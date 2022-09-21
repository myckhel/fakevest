<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class PinRequired
{
  /**
   * Handle an incoming request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
   * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
   */
  public function handle(Request $request, Closure $next)
  {
    $user = $request->user();

    if (isset($user->pin)) {
      $request->validate(['pin' => 'required|digits_between:4,8']);
      $pin = $request->pin;

      if (((int) $user->pin) != $pin) {
        abort(403, "Pin incorrect");
      }
    }

    return $next($request);
  }
}
