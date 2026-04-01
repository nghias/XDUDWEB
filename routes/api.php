<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NguoiDungController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TinNhanController;
use App\Http\Controllers\TinDangController;

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/

Route::post('/dang-ky',[AuthController::class,'dangKy']);
Route::post('/dang-nhap',[AuthController::class,'dangNhap']);


/*
|--------------------------------------------------------------------------
| NGUOI DUNG
|--------------------------------------------------------------------------
*/

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
    [NguoiDungController::class,'xoaNguoiDung']);


/*
|--------------------------------------------------------------------------
| TIN DANG
|--------------------------------------------------------------------------
*/

Route::get('/tat-ca-tin-dang',
    [TinDangController::class,'tatCaTinDang']
);

Route::get('/chi-tiet-tin-dang/{id}',
    [TinDangController::class,'chiTietTinDang']
);

Route::post('/tao-tin-dang',
    [TinDangController::class,'taoTinDang']
);

Route::put('/cap-nhat-tin-dang/{id}',
    [TinDangController::class,'capNhatTinDang']
);

Route::delete('/xoa-tin-dang/{id}',
    [TinDangController::class,'xoaTinDang']
);

Route::get('/tin-dang-cua-toi/{ma_chu_nha}',
    [TinDangController::class,'tinDangCuaToi']
);


/*
|--------------------------------------------------------------------------
| TIN NHAN
|--------------------------------------------------------------------------
*/

Route::get('/tat-ca-tin-nhan',
    [TinNhanController::class,'tatCaTinNhan']
);

Route::get('/chi-tiet-tin-nhan/{id}',
    [TinNhanController::class,'chiTietTinNhan']
);

Route::post('/gui-tin-nhan',
    [TinNhanController::class,'guiTinNhan']
);

Route::delete('/xoa-tin-nhan/{id}',
    [TinNhanController::class,'xoaTinNhan']
);

Route::get('/cuoc-tro-chuyen/{ma_cuoc_tro_chuyen}',
    [TinNhanController::class,'cuocTroChuyen']
);