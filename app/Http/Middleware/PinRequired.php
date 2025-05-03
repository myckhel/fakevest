<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PinRequired
{
  /**
   * Handle an incoming request.
   * Validates that a user's transaction PIN is provided and correct.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
   * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
   */
  public function handle(Request $request, Closure $next)
  {
    $user = $request->user();

    // First check if user has set a PIN
    if (!isset($user->pin)) {
      return new JsonResponse([
        'message' => 'Transaction PIN has not been set up for your account. Please set up a PIN first.',
        'status' => false,
        'has_pin' => false,
        'error_code' => 'PIN_NOT_SET'
      ], 403);
    }

    // Validate that PIN is present and has correct format
    $request->validate(['pin' => 'required|digits_between:4,8']);
    $pin = (int) $request->pin;

    // Check if provided PIN matches user's PIN
    if (((int) $user->pin) != $pin) {
      return new JsonResponse([
        'message' => 'Transaction PIN is incorrect',
        'status' => false,
        'has_pin' => true,
        'error_code' => 'INVALID_PIN'
      ], 403);
    }

    return $next($request);
  }
}
