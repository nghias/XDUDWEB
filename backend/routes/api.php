<?php
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Xin chào từ Laravel Backend!'
    ]);
});
