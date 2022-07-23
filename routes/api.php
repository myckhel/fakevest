<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentOptionController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\SavingController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserAccountController;
use App\Http\Controllers\UserChallengeController;
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
  Route::get(
    'whoami',
    fn (Request $request) => $request->user()
  );

  Route::put('users/{user}/avatar',        [UserController::class, 'updateAvatar']);

  Route::post('wallets/withdraw',       [WalletController::class, 'withdraw']);
  Route::get('wallets/dollar',          [WalletController::class, 'viewDollar']);
  Route::get('wallets/balance',         [WalletController::class, 'allBalance']);
  Route::get('wallets/naira',           [WalletController::class, 'viewNaira']);

  Route::post('challenges/{saving}/join',         [UserChallengeController::class, 'store']);

  Route::apiResource('users',           UserController::class)->only(['update', 'show']);
  Route::apiResource('wallets',         WalletController::class);
  Route::apiResource('payments',        PaymentController::class);
  Route::apiResource('payment_options', PaymentOptionController::class);
  Route::apiResource('plans',           PlanController::class)->only(['index', 'show']);
  Route::apiResource('savings',         SavingController::class);
  Route::apiResource('user_accounts',   UserAccountController::class);
  Route::apiResource('transactions',    TransactionController::class)->only(['index', 'show']);
  Route::apiResource('challenges',      ChallengeController::class)->only(['index', 'store', 'show']);
  Route::post('payments/verify',        [PaymentController::class, 'verify']);

  Route::get('logout', 'AuthController@logout');

  Route::post('hooks', 'PaymentController@hooks');
});

Route::group([], function () {
  Route::get('version', fn () => config('app.api.version'));
});
