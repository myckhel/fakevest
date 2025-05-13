<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Public routes
Route::middleware('guest')->group(function () {
  // Home page
  Route::get('/', fn() => Inertia::render('Home'))->name('home');

  // Authentication routes
  Route::get('/login', fn() => Inertia::render('Auth/Login'))->name('login');
  Route::get('/register', fn() => Inertia::render('Auth/Register'))->name('register');
  Route::get('/forgot-password', fn() => Inertia::render('Auth/ForgotPassword'))->name('password.request');
  Route::get('/reset-password/{token}', fn() => Inertia::render('Auth/ResetPassword', ['token' => request()->route('token'), 'email' => request()->query('email')]))->name('password.reset');

  // Social login
  Route::get('/login/{provider}', [AuthController::class, 'redirectToProvider'])->name('social.login');
  Route::get('/login/{provider}/callback', [AuthController::class, 'handleProviderCallback'])->name('social.callback');
});

// Protected routes - Changed from 'auth' to 'auth:web' for session-based authentication
Route::middleware('auth:web')->group(function () {
  // Email verification
  Route::get('/email/verify', fn() => Inertia::render('Auth/EmailVerification'))->name('verification.notice');
  Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verify'])->middleware(['signed'])->name('verification.verify');
  // Route::post('/email/verification-notification', [AuthController::class, 'resend'])->middleware(['throttle:6,1'])->name('verification.send');

  // Standard pages requiring only authentication
  Route::middleware('verified')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');
    Route::get('/profile', fn() => Inertia::render('Profile/View'))->name('profile');
    Route::get('/profile/edit', fn() => Inertia::render('Profile/Edit'))->name('profile.edit');

    // Added new routes for Transactions and Wallets
    Route::get('/transactions', fn() => Inertia::render('Transactions'))->name('transactions');
    Route::get('/wallets', fn() => Inertia::render('Wallets'))->name('wallets');
  });

  // Logout route
  Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
});

// UI Theme Showcase (Dev only)
Route::get('/ui/theme-showcase', function () {
  return inertia('Demo/ThemeShowcasePage');
});
