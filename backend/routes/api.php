<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NguoiDungController;


Route::get('/tat-ca-nguoi-dung',
    [NguoiDungController::class,'tatCaNguoiDung']
);

Route::get('/chi-tiet-nguoi-dung/{id}',
    [NguoiDungController::class,'chiTietNguoiDung']
);

Route::post('/tao-nguoi-dung',
    [NguoiDungController::class,'taoNguoiDung']
);

Route::put('/cap-nhat-nguoi-dung/{id}',
    [NguoiDungController::class,'capNhatNguoiDung']
);

Route::delete('/xoa-nguoi-dung/{id}',
    [NguoiDungController::class,'xoaNguoiDung']
);