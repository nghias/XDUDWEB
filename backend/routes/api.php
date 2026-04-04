<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;

Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);

Route::post('/posts', [PostController::class, 'store']);
Route::put('/posts/{id}', [PostController::class, 'update']);
Route::delete('/posts/{id}', [PostController::class, 'destroy']);

Route::post('/messages', [MessageController::class, 'send']);
Route::get('/messages/{user_id}', [MessageController::class, 'getMessages']);

Route::apiResource('nguoi-dung', UserController::class);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::post('/reset-password', [AuthController::class, 'resetPassword']);
