<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\UnauthorizedException;

class AuthController extends Controller
{
  use ThrottlesLogins;

  /**
   * Mark the authenticated user's email address as verified.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
   *
   * @throws \Illuminate\Auth\Access\AuthorizationException
   */
  public function verify(Request $request)
  {
    if (!hash_equals((string) $request->route('id'), (string) $request->user()->getKey())) {
      throw new UnauthorizedException;
    }

    if (!hash_equals((string) $request->route('hash'), sha1($request->user()->getEmailForVerification()))) {
      throw new UnauthorizedException;
    }

    if ($request->user()->hasVerifiedEmail()) {
      return new JsonResponse([], 204);
    }

    $request->user()->markEmailAsVerified();

    return new JsonResponse([], 204);
  }

  /**
   * Resend the email verification notification.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
   */
  public function resend(Request $request)
  {
    if ($request->user()->hasVerifiedEmail()) {
      return new JsonResponse([], 204);
    }

    $request->user()->sendEmailVerificationNotification();

    return new JsonResponse([], 202);
  }

  /**
   * Send a reset link to the given user.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
   */
  public function sendResetLinkEmail(Request $request)
  {
    $request->validate(['email' => 'required|email']);

    // We will send the password reset link to this user. Once we have attempted
    // to send the link, we will examine the response then see the message we
    // need to show to the user. Finally, we'll send out a proper response.
    $response = $this->broker()->sendResetLink(
      $request->only('email')
    );

    return $response == Password::RESET_LINK_SENT
      ? ['message' => trans($response)]
      :
      throw ValidationException::withMessages([
        'email' => [trans($response)],
      ]);
  }

  /**
   * Get the broker to be used during password reset.
   *
   * @return \Illuminate\Contracts\Auth\PasswordBroker
   */
  public function broker()
  {
    return Password::broker();
  }

  /**
   * Confirm the given user's password.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
   */
  public function confirm(Request $request)
  {
    $request->validate([
      'password' => 'required|current_password:api',
    ]);

    $request->session()->put('auth.password_confirmed_at', time());

    return new JsonResponse([], 204);
  }

  /**
   * Handle a registration request for the application.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
   */
  public function register(Request $request)
  {
    $request->validate([]);

    $user = $this->create($request->all());

    $this->guard()->login($user);

    return new JsonResponse([], 201);
  }

  /**
   * Handle a login request to the application.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\Response|\Illuminate\Http\JsonResponse
   *
   * @throws \Illuminate\Validation\ValidationException
   */
  public function login(Request $request)
  {
    $request->validate([
      'email'       => 'required|email',
      'password'    => 'required|string',
      'remember_me' => 'boolean'
    ]);

    $user = User::whereEmail($request->email)->first();

    if ($user) {
      // If the class is using the ThrottlesLogins trait, we can automatically throttle
      // the login attempts for this application. We'll key this by the username and
      // the IP address of the client making these requests into this application.
      if (
        method_exists($this, 'hasTooManyLoginAttempts') &&
        $this->hasTooManyLoginAttempts($request)
      ) {
        $this->fireLockoutEvent($request);

        return $this->sendLockoutResponse($request);
      }

      if (!$this->guard()->attempt(
        $request->only('email', 'password'),
        $request->filled('remember')
      )) {
        // If the login attempt was unsuccessful we will increment the number of attempts
        // to login and redirect the user back to the login form. Of course, when this
        // user surpasses their maximum number of attempts they will get locked out.
        $this->incrementLoginAttempts($request);

        return response()->json(
          [
            $this->username() => [trans('auth.failed')],
            'message' => 'credentials does not match our records',
            'status'  => false,
          ],
          401
        );
      }

      // $user->withUrls('avatar');

      $token       = $user->grantMeToken();

      if ($request->hasSession()) {
        $request->session()->put('auth.password_confirmed_at', time());
      }

      return response()->json([
        'user'        => $user,
        'token'       => $token['token'],
        'token_type'  => $token['token_type'],
        // 'expires_at'  => $token['expires_at'],
      ]);
    } else {
      throw ValidationException::withMessages([
        'password' => [trans('validation.password')],
      ]);
    }
  }

  function verification()
  {
    // $this->middleware('signed')->only('verify');
    // $this->middleware('throttle:6,1')->only('verify', 'resend');
  }
  /**
   * Log the user out of the application.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\JsonResponse
   */
  public function logout(Request $request)
  {
    $request->user()->currentAccessToken()->delete();

    return response()->json([
      'message' => 'Successfully logged out'
    ]);
  }

  /**
   * Get the guard to be used during authentication.
   *
   * @return \Illuminate\Contracts\Auth\StatefulGuard
   */
  protected function guard()
  {
    return auth();
  }

  /**
   * Get the login username to be used by the controller.
   *
   * @return string
   */
  public function username()
  {
    return 'email';
  }
}
