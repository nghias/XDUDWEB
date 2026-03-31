<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\MessageController;

Route::get('/users',[UserController::class,'index']);
Route::get('/users/{id}',[UserController::class,'show']);
Route::post('/users',[UserController::class,'store']);

Route::get('/posts',[PostController::class,'index']);
Route::get('/posts/{id}',[PostController::class,'show']);
Route::post('/posts',[PostController::class,'store']);

Route::get('/messages',[MessageController::class,'index']);
Route::post('/messages',[MessageController::class,'store']);