<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetMailer;
use App\Models\User;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\UnauthorizedException;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class AuthController extends Controller
{
  use ThrottlesLogins;

  /**
   * Redirect the user to the Provider authentication page.
   *
   * @param $provider
   * @return JsonResponse
   */
  public function redirectToProvider($provider)
  {
    $validated = $this->validateProvider($provider);
    if (!is_null($validated)) {
      return $validated;
    }

    return ['url' => Socialite::driver($provider)->stateless()->redirect()->getTargetUrl()];
  }

  /**
   * Obtain the user information from Provider.
   *
   * @param $provider
   * @return JsonResponse
   */
  public function handleProviderCallback($provider)
  {
    $validated = $this->validateProvider($provider);
    if (!is_null($validated)) {
      return $validated;
    }
    try {
      $user = Socialite::driver($provider)->stateless()->user();
    } catch (ClientException $exception) {
      return response()->json(['error' => 'Invalid credentials provided.'], 422);
    }

    $userCreated = User::firstOrCreate(
      [
        'email' => $user->getEmail()
      ],
      [
        'email_verified_at' => now(),
        'fullname' => $user->getName(),
        'status' => true,
      ]
    );
    $userCreated->providers()->updateOrCreate(
      [
        'provider' => $provider,
        'provider_id' => $user->getId(),
      ],
      [
        'avatar' => $user->getAvatar()
      ]
    );
    $token = $userCreated->grantMeToken();

    return response()->json([
      'message'     => 'Successfully authenticated!',
      'user'        => $userCreated,
      'token'       => $token['token'],
      'token_type'  => $token['token_type'],
    ], 201);
  }

  /**
   * @param $provider
   * @return JsonResponse
   */
  protected function validateProvider($provider)
  {
    if (!in_array($provider, ['facebook', 'github', 'google'])) {
      return response()->json(['error' => 'Please login using facebook, github or google'], 422);
    }
  }

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

    $user = User::whereEmail($request->email)->firstOrFail();
    $token = Password::getRepository()->create($user);

    Mail::to($user)->send(new PasswordResetMailer($token));

    return ['message' => 'We have emailed your password reset token!', 'status' => true];
  }

  function resetPassword(Request $request)
  {
    $request->validate([
      'token'     => 'required',
      'email'     => 'required|email',
      'password'  => 'required|min:8|confirmed',
    ]);

    $status = Password::reset(
      $request->only('email', 'password', 'password_confirmation', 'token'),
      function ($user, $password) {
        $user->forceFill([
          'password' => Hash::make($password)
        ])->setRememberToken(Str::random(60));

        $user->save();

        event(new PasswordReset($user));
      }
    );

    return $status === Password::PASSWORD_RESET
      ? ['status' => true, 'message' => 'Password Reset Successfully']
      : response()->json(['email' => [__($status)]], 422);
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
   * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
   */
  public function register(Request $request)
  {
    $request->validate([
      'username'            => "unique:users",
      'phone'               => [Rule::requiredIf(!$request->email), "digits_between:10,20"],
      'email'               => [Rule::requiredIf(!$request->phone), "email", "unique:users,email"],
      'password'            => 'required|min:6|confirmed',
      'fullname'            => 'required|min:6',
      'avatar'              => 'image',
      'player_id'           => '',
      'device_type'         => 'in:ios,android,web',
      'device_name'         => '',
    ], [
      'password.confirmed'  => 'The password does not match.'
    ]);

    $avatar = $request->avatar;

    $user = User::create([
      'password' => Hash::make($request->password),
    ] + $request->only(
      ['username', 'email', 'phone', 'fullname']
    ));

    ($user && $avatar) && $user->saveImage($avatar, 'avatar');

    $request->player_id && $user?->updatePush(
      $request->only([
        'player_id',
        'device_type',
        'device_name'
      ])
    );

    // Email verification is now handled by UserObserver -> UserRegistered event -> SendEmailVerificationListener

    // Handle API requests with token response
    if ($request->wantsJson()) {
      $token = $user->grantMeToken();

      return response()->json([
        'message'     => 'Successfully registered! Please check your email to verify your account.',
        'user'        => $user,
        'token'       => $token['token'],
        'token_type'  => $token['token_type'],
      ], 201);
    }

    // Handle Inertia/web-based registrations
    auth('web')->login($user);

    return redirect()->intended(
      route('verification.notice')
    )->with('status', 'Registration successful! Please check your email to verify your account.');
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
      'username'    => [Rule::requiredIf(!$request->phone && !$request->email)],
      'phone'       => [Rule::requiredIf(!$request->email && !$request->username), "digits_between:10,11"],
      'email'       => [Rule::requiredIf(!$request->phone && !$request->username), 'email'],
      'password'    => 'required|string',
      'player_id'   => '',
      'device_type' => 'in:ios,android,web',
      'device_name' => '',
    ]);

    $email    = $request->email;
    $username = $request->username;
    $phone    = $request->phone;
    $password = $request->password;

    $user = User::when(
      $email,
      fn($q) => $q->whereEmail($request->email),
      fn($q) => $q->when(
        $username,
        fn($q) => $q->whereUsername($username),
        fn($q) => $q->wherePhone($phone),
      )
    )->first();

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

      if (!$request->wantsJson()) {
        if (auth('web')->attempt($request->only(['password', 'email']))) {
          // proceed
        } else {
          return redirect()->back()->withErrors(['message' => 'credentials does not match']);
        }
      } else {
        if (!Hash::check($password, $user->password)) {
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
      }

      $request->player_id && $user->updatePush(
        $request->only([
          'player_id',
          'device_type',
          'device_name'
        ])
      );

      $user->withUrls('avatar');

      $token       = $user->grantMeToken();

      if (!$request->wantsJson()) {
        return redirect('/dashboard');
      } else {
        return response()->json([
          'user'        => $user,
          'token'       => $token['token'],
          'token_type'  => $token['token_type'],
          // 'expires_at'  => $token['expires_at'],
        ]);
      }
    } else {
      throw ValidationException::withMessages([
        'user' => [trans('passwords.user')],
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
   * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
   */
  public function logout(Request $request)
  {
    // For API token-based authentication
    if ($request->wantsJson()) {
      $request->user()->currentAccessToken()->delete();

      return response()->json([
        'message' => 'Successfully logged out'
      ]);
    }

    // For web session-based authentication (Inertia)
    auth('web')->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect()->route('login')->with('status', 'You have been logged out successfully');
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
