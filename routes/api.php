<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentOptionController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\SavingController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\UserAccountController;
use App\Http\Controllers\UserChallengeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\WalletInterestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Myckhel\Paystack\Http\Controllers\MiscellaneousController;
use Myckhel\Paystack\Http\Controllers\VerificationController as PVerificationController;

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

  Route::put('users/{user}/avatar',     [UserController::class, 'updateAvatar']);
  Route::get('users/portfolio',         [UserController::class, 'portfolio']);

  Route::post('wallets/withdraw',       [WalletController::class, 'withdraw']);
  Route::get('wallets/dollar',          [WalletController::class, 'viewDollar']);
  Route::get('wallets/balance',         [WalletController::class, 'totalSavings']);
  Route::get('wallets/naira',           [WalletController::class, 'viewNaira']);
  Route::post('wallet_interests/{walletInterest}/accept', [WalletInterestController::class, 'accept']);

  Route::post('challenges/{saving}/join',    [UserChallengeController::class, 'store']);

  Route::get('jobs/user/savings/matured',    [JobController::class, 'userSavingMatured']);
  Route::get('jobs/challenge/won',           [JobController::class, 'userChallengeWon']);

  Route::group(['prefix' => 'paystack'], function () {
    // miscellaneous
    Route::get('bank',                    [MiscellaneousController::class, 'listBanks']);
    Route::get('banks',                   [MiscellaneousController::class, 'listProviders']);
    Route::get('country',                 [MiscellaneousController::class, 'listCountries']);

    // verifications
    Route::get('bank/resolve',             [PVerificationController::class, 'resolve']);
    Route::post('bank/validate',           [PVerificationController::class, 'validateAccount']);
    Route::get('decision/bin/{bin}',       [PVerificationController::class, 'resolveCardBIN']);
  });

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
  Route::apiResource('wallet_interests',  WalletInterestController::class)->only(['index']);
  Route::apiResource('notifications',   NotificationController::class)->only(['index', 'show']);
  Route::apiResource('verifications',   VerificationController::class);
  Route::apiResource('transfers',       TransferController::class)->only(['index', 'store']);

  Route::get('logout', 'AuthController@logout');

  Route::post('hooks', 'PaymentController@hooks');
});

Route::group([], function () {
  Route::get('version', fn () => config('app.api.version'));
});
