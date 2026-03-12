<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

// Laravel mặc định sẽ thêm tiền tố /api vào các route này.
// Vậy BASE_API của bạn sẽ là: https://ten-mien-backend.com/api
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
