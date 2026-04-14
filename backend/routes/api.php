<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TinDangController;
use App\Http\Controllers\TinNhanController;
use App\Http\Controllers\NguoiDungController;
use App\Http\Controllers\HinhAnhTinController;
use App\Http\Controllers\DatPhongController;
use App\Http\Controllers\Admin\GoiDichVuController;

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/cap-nhat-thong-tin', [NguoiDungController::class, 'capNhatThongTinCaNhan']);
});


/*
|--------------------------------------------------------------------------
| TIN ĐĂNG
|--------------------------------------------------------------------------
*/

Route::get('/tat-ca-tin-dang', [TinDangController::class, 'tatCaTinDang']);

Route::get('/chi-tiet-tin-dang/{id}',
[TinDangController::class, 'chiTietTinDang']
);

Route::post('/tao-tin-dang',
[TinDangController::class, 'taoTinDang']
);

Route::put('/cap-nhat-tin-dang/{id}',
[TinDangController::class, 'capNhatTinDang']
);

Route::delete('/xoa-tin-dang/{id}',
[TinDangController::class, 'xoaTinDang']
);

Route::get('/tin-dang-cua-toi/{ma_chu_nha}',
[TinDangController::class, 'tinDangCuaToi']
);

Route::get('/tim-kiem-tin-dang',
[TinDangController::class, 'timKiemNangCao']
);

/*
|--------------------------------------------------------------------------
| TIN NHẮN
|--------------------------------------------------------------------------
*/

Route::get('/tat-ca-tin-nhan',
[TinNhanController::class, 'tatCaTinNhan']);

Route::get('/chi-tiet-tin-nhan/{id}',
[TinNhanController::class, 'chiTietTinNhan']);

Route::post('/gui-tin-nhan',
[TinNhanController::class, 'guiTinNhan']);

Route::delete('/xoa-tin-nhan/{id}',
[TinNhanController::class, 'xoaTinNhan']);

Route::get('/cuoc-tro-chuyen/{ma_cuoc_tro_chuyen}',
[TinNhanController::class, 'cuocTroChuyen']);

/*
|--------------------------------------------------------------------------
| NGƯỜI DÙNG
|--------------------------------------------------------------------------
*/

Route::get('/tat-ca-nguoi-dung',
[NguoiDungController::class,'tatCaNguoiDung']);

Route::get('/chi-tiet-nguoi-dung/{id}',
[NguoiDungController::class,'chiTietNguoiDung']);

Route::post('/tao-nguoi-dung',
[NguoiDungController::class,'taoNguoiDung']);

Route::put('/cap-nhat-nguoi-dung/{id}',
[NguoiDungController::class,'capNhatNguoiDung']);

Route::delete('/xoa-nguoi-dung/{id}',
[NguoiDungController::class,'xoaNguoiDung']);

/*
|--------------------------------------------------------------------------
| HÌNH ẢNH TIN ĐĂNG
|--------------------------------------------------------------------------
*/

Route::get('/anh-tin/{ma_tin_dang}',
[HinhAnhTinController::class,'danhSachAnh']);

Route::post('/them-anh-tin',
[HinhAnhTinController::class,'themAnh']);

Route::put('/cap-nhat-anh-tin/{id}',
[HinhAnhTinController::class,'capNhatAnh']);

Route::delete('/xoa-anh-tin/{id}',
[HinhAnhTinController::class,'xoaAnh']);

/*
|--------------------------------------------------------------------------
| ĐẶT PHÒNG
|--------------------------------------------------------------------------
*/

Route::post('/dat-phong',[DatPhongController::class,'datPhong']);

Route::get('/danh-sach-dat-phong',
[DatPhongController::class,'danhSachDatPhong']);

Route::get('/dat-phong-cua-toi/{ma_nguoi_dat}',
[DatPhongController::class,'datPhongCuaToi']);

Route::put('/xac-nhan-dat-phong/{id}',
[DatPhongController::class,'xacNhan']);

Route::delete('/huy-dat-phong/{id}',
[DatPhongController::class,'huyDatPhong']);

/*
|--------------------------------------------------------------------------
| DichVu
|--------------------------------------------------------------------------
*/

Route::prefix('admin/goidichvu')->group(function () {
    Route::get('/', [GoiDichVuController::class, 'index']);      
    Route::post('/', [GoiDichVuController::class, 'store']);     
    Route::put('/{id}', [GoiDichVuController::class, 'update']); 
}); 

