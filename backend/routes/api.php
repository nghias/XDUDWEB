<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\MessageController;

Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);

Route::post('/posts', [PostController::class, 'store']);
Route::put('/posts/{id}', [PostController::class, 'update']);
Route::delete('/posts/{id}', [PostController::class, 'destroy']);

Route::post('/messages', [MessageController::class, 'send']);
Route::get('/messages/{user_id}', [MessageController::class, 'getMessages']);