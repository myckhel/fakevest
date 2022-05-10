<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentOptionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WalletController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
  return $request->user();
});

Route::group(['middleware' => 'guest'], function () {
  Route::post('login', 'AuthController@login');
  Route::post('register', 'AuthController@register');
  Route::get('users/random', [UserController::class, 'random']);
  // social
  Route::get('/login/{provider}', [AuthController::class, 'redirectToProvider']);
  Route::get('/login/{provider}/callback', [AuthController::class, 'handleProviderCallback']);
});

Route::group(['middleware' => ['auth:api']], function () {
  Route::apiResource('wallets',         WalletController::class);
  Route::apiResource('payments',        PaymentController::class);
  Route::apiResource('payment_options', PaymentOptionController::class);
  Route::post('payments/verify',        [PaymentController::class, 'verify']);

  Route::get('logout', 'AuthController@logout');
});

Route::group([], function () {
  Route::get('version', fn () => config('app.api.version'));
});
