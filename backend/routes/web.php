<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        "project" => "XDUDWEB - Backend API",
        "status" => "running",
        "server" => "Laravel on Render",
        "apis" => [
            "posts" => "/api/posts",
            "users" => "/api/users",
            "messages" => "/api/messages"
        ]
    ]);
});