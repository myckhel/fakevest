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
use App\Http\Middleware\PinRequired;
use Binkode\Paystack\Http\Controllers\HookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Binkode\Paystack\Http\Controllers\MiscellaneousController;
use Binkode\Paystack\Http\Controllers\VerificationController as PVerificationController;

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

Route::prefix('v1')->group(function () {
  // Public routes
  Route::post('/register', [AuthController::class, 'register']);
  Route::post('/login', [AuthController::class, 'login']);
  Route::post('/password/forgot', [AuthController::class, 'sendResetLinkEmail']);
  Route::post('/password/reset', [AuthController::class, 'resetPassword']);

  // Social login routes
  Route::get('/login/{provider}', [AuthController::class, 'redirectToProvider']);
  Route::get('/login/{provider}/callback', [AuthController::class, 'handleProviderCallback']);

  // Email verification
  // Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verify'])->name('verification.verify');

  // Payment webhook
  Route::post('/hooks/paystack', [PaymentController::class, 'hooks']);

  // Protected routes
  Route::middleware(['auth:sanctum'])->group(function () {
    // Auth related
    Route::get('/whoami', [AuthController::class, 'whoami']);
    Route::get('/logout', [AuthController::class, 'logout']);
    Route::post('/email/verification-notification', [AuthController::class, 'resend'])->name('verification.send');
    Route::post('wallets/withdraw',       [WalletController::class, 'withdraw'])->middleware([PinRequired::class]);
    Route::get('wallets/dollar',          [WalletController::class, 'viewDollar']);
    Route::get('wallets/balance',         [WalletController::class, 'totalSavings']);
    Route::get('wallets/naira',           [WalletController::class, 'viewNaira']);
    Route::post('wallet_interests/{walletInterest}/accept', [WalletInterestController::class, 'accept']);

    // User profile
    Route::put('/users/password', [UserController::class, 'changePassword']);
    Route::post('/users/pin', [UserController::class, 'verifyPin']);
    Route::put('/users/pin', [UserController::class, 'updatePin']);
    Route::get('/users/portfolio', [UserController::class, 'portfolio']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::post('/users/{user}/avatar', [UserController::class, 'uploadAvatar']);

    // User accounts, payments, and financial operations
    Route::apiResource('/user-accounts', UserAccountController::class);
    Route::post('/payments/verify', [PaymentController::class, 'verify']);
    Route::apiResource('/payments', PaymentController::class)->only(['index', 'show']);
    Route::apiResource('/plans', PlanController::class);
    Route::apiResource('/savings', SavingController::class);
    Route::apiResource('/transactions', TransactionController::class)->only(['index', 'show']);
    Route::apiResource('/transfers', TransferController::class);
    Route::apiResource('/user-challenges', UserChallengeController::class);
    Route::apiResource('/verifications', VerificationController::class);
    Route::apiResource('/wallet-interests', WalletInterestController::class)->only(['index']);
    Route::apiResource('/wallets', WalletController::class)->only(['index']);

    // Challenge related routes
    Route::get('/challenges', [ChallengeController::class, 'index']);
    Route::get('/challenges/{saving}', [ChallengeController::class, 'show']);
    Route::apiResource('/savings/{saving}/challenges', UserChallengeController::class)->only(['store']);

    // Jobs and scheduled tasks
    Route::get('/jobs/saving-matured', [JobController::class, 'userSavingMatured']);
    Route::get('/jobs/challenge-won', [JobController::class, 'userChallengeWon']);
  });

  // Admin routes
  Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/users', [UserController::class, 'indexAll']);
    // Additional admin routes can be added here
  });
});
