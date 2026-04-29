<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\WasteController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;

/*
|--------------------------------------------------------------------------
| API Routes – EcoRuk
|--------------------------------------------------------------------------
*/

// ========================
// AUTH (PUBLIC)
// ========================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);


// ========================
// PRODUCT (PUBLIC)
// ========================
Route::get('/products',       [ProductController::class, 'index']);
Route::get('/products/{id}',  [ProductController::class, 'show']);


// ========================
// PROTECTED (SANCTUM)
// ========================
Route::middleware('auth:sanctum')->group(function () {

    // AUTH
    Route::post('/logout', [AuthController::class, 'logout']);

    // DASHBOARD
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // ========================
    // WASTE (PERTUKARAN)
    // ========================
    Route::prefix('wastes')->group(function () {
        Route::post('/scan',     [WasteController::class, 'scan']);
        Route::get('/current',   [WasteController::class, 'current']);
        Route::post('/exchange', [WasteController::class, 'exchange']);
    });

    // ========================
    // ORDER (CHECKOUT)
    // ========================
    Route::post('/orders', [OrderController::class, 'store']);
});