<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TinDangController;
use App\Http\Controllers\TinNhanController;
use App\Http\Controllers\NguoiDungController;
use App\Http\Controllers\Admin\GoiDichVuController;
use App\Models\LoaiPhong;
use App\Models\TienIch;

/*
|--------------------------------------------------------------------------
| AUTHENTICATION & PROFILE
|--------------------------------------------------------------------------
*/

// Public Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Protected Auth Routes (Yêu cầu đăng nhập)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::put('/cap-nhat-thong-tin', [NguoiDungController::class, 'capNhatThongTinCaNhan']);

    Route::get('/admin/users', [NguoiDungController::class, 'tatCaNguoiDung']);
    Route::get('/admin/tin-dang', [TinDangController::class, 'tatCaTinDang']);
    Route::post('/admin/tin-dang/{id}/duyet', [TinDangController::class, 'duyetTin']);

    Route::get('/admin/users', [\App\Http\Controllers\NguoiDungController::class, 'tatCaNguoiDung']);
    Route::post('/admin/users/{id}/toggle-status', [\App\Http\Controllers\NguoiDungController::class, 'toggleStatus']);
});

/*
|--------------------------------------------------------------------------
| TIN ĐĂNG
|--------------------------------------------------------------------------
*/

Route::get('/tat-ca-tin-dang', [TinDangController::class, 'tatCaTinDang']);
Route::get('/chi-tiet-tin-dang/{id}', [TinDangController::class, 'chiTietTinDang']);
Route::get('/tim-kiem-tin-dang', [TinDangController::class, 'timKiemNangCao']);
Route::get('/tin-dang-cua-toi/{ma_chu_nha}', [TinDangController::class, 'tinDangCuaToi']);

Route::post('/tao-tin-dang', [TinDangController::class, 'taoTinDang']);
Route::put('/cap-nhat-tin-dang/{id}', [TinDangController::class, 'capNhatTinDang']);
Route::delete('/xoa-tin-dang/{id}', [TinDangController::class, 'xoaTinDang']);

/*
|--------------------------------------------------------------------------
| TIN NHẮN
|--------------------------------------------------------------------------
*/

Route::get('/tat-ca-tin-nhan', [TinNhanController::class, 'tatCaTinNhan']);
Route::get('/chi-tiet-tin-nhan/{id}', [TinNhanController::class, 'chiTietTinNhan']);
Route::get('/cuoc-tro-chuyen/{ma_cuoc_tro_chuyen}', [TinNhanController::class, 'cuocTroChuyen']);

Route::post('/gui-tin-nhan', [TinNhanController::class, 'guiTinNhan']);
Route::delete('/xoa-tin-nhan/{id}', [TinNhanController::class, 'xoaTinNhan']);

/*
|--------------------------------------------------------------------------
| NGƯỜI DÙNG
|--------------------------------------------------------------------------
*/

Route::get('/tat-ca-nguoi-dung', [NguoiDungController::class, 'tatCaNguoiDung']);
Route::get('/chi-tiet-nguoi-dung/{id}', [NguoiDungController::class, 'chiTietNguoiDung']);

Route::post('/tao-nguoi-dung', [NguoiDungController::class, 'taoNguoiDung']);
Route::put('/cap-nhat-nguoi-dung/{id}', [NguoiDungController::class, 'capNhatNguoiDung']);
Route::delete('/xoa-nguoi-dung/{id}', [NguoiDungController::class, 'xoaNguoiDung']);

/*
|--------------------------------------------------------------------------
| DANH MỤC (Loại Phòng & Tiện Ích)
|--------------------------------------------------------------------------
*/

Route::get('/loai-phong', function () {
    return response()->json(LoaiPhong::all());
});

Route::get('/tien-ich', function () {
    return response()->json(TienIch::all());
});

/*
|--------------------------------------------------------------------------
| ADMIN / GÓI DỊCH VỤ
|--------------------------------------------------------------------------
*/

Route::prefix('admin/goidichvu')->group(function () {
    Route::get('/', [GoiDichVuController::class, 'index']);      
    Route::post('/', [GoiDichVuController::class, 'store']);     
    Route::put('/{id}', [GoiDichVuController::class, 'update']); 
}); 

/*
|--------------------------------------------------------------------------
| SYSTEM UTILITIES
|--------------------------------------------------------------------------
*/

// Route bí mật để xóa cache trên Host không có Terminal
Route::get('/clear-cache', function() {
    Artisan::call('config:clear');
    Artisan::call('route:clear');
    Artisan::call('view:clear');
    
    return "Cấu hình đã được nạp mới! Bây giờ Laravel sẽ nhận biến CLOUDINARY_URL từ Render.";
});