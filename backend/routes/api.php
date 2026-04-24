<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WasteController;

Route::get('/test', function () {
    return "API jalan";
});

Route::post('/waste', [WasteController::class, 'store']);
Route::get('/dashboard', [WasteController::class, 'dashboard']);
Route::get('/waste/stats', [WasteController::class, 'stats']);