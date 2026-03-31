<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserController;

Route::get('/users',[UserController::class,'index']);
Route::get('/users/{id}',[UserController::class,'show']);
Route::post('/users',[UserController::class,'store']);

Route::get('/posts',[PostController::class,'index']);
Route::get('/posts/{id}',[PostController::class,'show']);
Route::post('/posts',[PostController::class,'store']);

 be-user
Route::get('/messages',[MessageController::class,'index']);
Route::post('/messages',[MessageController::class,'store']);

Route::post('/messages', [MessageController::class, 'send']);
Route::get('/messages/{user_id}', [MessageController::class, 'getMessages']);

Route::apiResource('nguoi-dung', UserController::class);
 main
