<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        "project" => "XDUDWEB - Backend API",
        "status" => "running",
        "server" => "Laravel on Render",
        "apis" => [
            "tat_ca_tin_dang" => "/api/tat-ca-tin-dang",
            "tat_ca_nguoi_dung" => "/api/tat-ca-nguoi-dung",
            "tat_ca_tin_nhan" => "/api/tat-ca-tin-nhan",
            "dang_ky" => "/api/dang-ky",
            "dang_nhap" => "/api/dang-nhap"
        ]
    ]);
});