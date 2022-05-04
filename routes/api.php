<?php

use App\Http\Controllers\AuthController;
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
  // social
  Route::get('/login/{provider}', [AuthController::class, 'redirectToProvider']);
  Route::get('/login/{provider}/callback', [AuthController::class, 'handleProviderCallback']);
});

Route::group(['middleware' => ['auth:api']], function () {
  Route::get('logout', 'AuthController@logout');
});

Route::group([], function () {
  Route::get('version', fn () => config('app.api.version'));
});
