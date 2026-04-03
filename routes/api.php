<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NguoiDungController;
use App\Http\Controllers\TinDangController;
use App\Http\Controllers\TinNhanController;

/*
|--------------------------------------------------------------------------
| NGUOI DUNG
|--------------------------------------------------------------------------
*/

Route::get('/tat-ca-nguoi-dung',[NguoiDungController::class,'tatCaNguoiDung']);
Route::get('/chi-tiet-nguoi-dung/{id}',[NguoiDungController::class,'chiTietNguoiDung']);

/*
|--------------------------------------------------------------------------
| TIN DANG
|--------------------------------------------------------------------------
*/

Route::get('/tat-ca-tin-dang',[TinDangController::class,'tatCaTinDang']);
Route::get('/chi-tiet-tin-dang/{id}',[TinDangController::class,'chiTietTinDang']);
Route::get('/tin-dang-cua-toi/{ma_chu_nha}',[TinDangController::class,'tinDangCuaToi']);

/*
|--------------------------------------------------------------------------
| TIN NHAN
|--------------------------------------------------------------------------
*/

Route::get('/tat-ca-tin-nhan',[TinNhanController::class,'tatCaTinNhan']);
Route::get('/chi-tiet-tin-nhan/{id}',[TinNhanController::class,'chiTietTinNhan']);
Route::get('/cuoc-tro-chuyen/{ma_cuoc_tro_chuyen}',[TinNhanController::class,'cuocTroChuyen']);