<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        "project" => "XDUDWEB - Backend API",
        "status" => "running",
        "server" => "Laravel on Render",
        "apis" => [
            "tin_dang" => "/api/tin_dang",
            "users" => "/api/users",
            "tin_nhan" => "/api/tin_nhan"
        ]
    ]);
});