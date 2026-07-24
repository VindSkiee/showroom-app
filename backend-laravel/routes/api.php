<?php

use App\Http\Controllers\Api\{CarController, PromoController, SaleController, UploadController, VehicleController};
use App\Http\Controllers\Auth\{AuthenticatedSessionController, CurrentUserController, NewPasswordController, RegisteredUserController};
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes — Auth
|--------------------------------------------------------------------------
*/

// Login — Breeze LoginRequest handles rate limiting (5 attempts/min)
Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('throttle:login');

// Register
Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('throttle:register');

// Password reset
Route::post('/forgot-password', [NewPasswordController::class, 'store'])
    ->middleware('throttle:password');
Route::post('/reset-password', [NewPasswordController::class, 'reset']);

/*
|--------------------------------------------------------------------------
| Public Routes — API
|--------------------------------------------------------------------------
*/

Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/vehicles/{id}', [VehicleController::class, 'show']);
Route::get('/cars', [CarController::class, 'index']);
Route::get('/cars/{id}', [CarController::class, 'show']);
Route::get('/promos', [PromoController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Protected Routes — Auth Required (Sanctum Bearer Token)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Current user info
    Route::get('/user', [CurrentUserController::class, 'show']);
    Route::get('/auth/me', [CurrentUserController::class, 'show']);

    // Logout
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    // Sales CRUD
    Route::get('/sales', [SaleController::class, 'index']);
    Route::post('/sales', [SaleController::class, 'store']);
    Route::delete('/sales/{sale}', [SaleController::class, 'destroy']);

    // Media upload
    Route::post('/upload', [UploadController::class, 'store']);
});
