<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan; // Thêm import này cho sạch code

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TinDangController;
use App\Http\Controllers\TinNhanController;
use App\Http\Controllers\NguoiDungController;
use App\Http\Controllers\Admin\GoiDichVuController;
use App\Models\LoaiPhong;
use App\Models\TienIch;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (Ai cũng xem được)
|--------------------------------------------------------------------------
*/

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Tin Đăng (Xem danh sách và chi tiết không cần login)
Route::get('/tat-ca-tin-dang', [TinDangController::class, 'tatCaTinDang']);
Route::get('/chi-tiet-tin-dang/{id}', [TinDangController::class, 'chiTietTinDang']);
Route::get('/tim-kiem-tin-dang', [TinDangController::class, 'timKiemNangCao']);

// Danh mục (Để React load vào Form)
Route::get('/loai-phong', function () {
    return response()->json(LoaiPhong::all());
});
Route::get('/tien-ich', function () {
    return response()->json(TienIch::all());
});

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES (Bắt buộc phải Đăng nhập - Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    
    // Auth & Profile
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::get('/user', function (Request $request) { return $request->user(); });
    Route::put('/cap-nhat-thong-tin', [NguoiDungController::class, 'capNhatThongTinCaNhan']);

    // Quản lý Tin Đăng (Chỉ chủ trọ mới dùng các quyền này)
    Route::post('/tao-tin-dang', [TinDangController::class, 'taoTinDang']);
    Route::put('/cap-nhat-tin-dang/{id}', [TinDangController::class, 'capNhatTinDang']);
    Route::delete('/xoa-tin-dang/{id}', [TinDangController::class, 'xoaTinDang']);
    Route::get('/tin-dang-cua-toi/{ma_chu_nha}', [TinDangController::class, 'tinDangCuaToi']);

    // Tin Nhắn
    Route::get('/tat-ca-tin-nhan', [TinNhanController::class, 'tatCaTinNhan']);
    Route::get('/chi-tiet-tin-nhan/{id}', [TinNhanController::class, 'chiTietTinNhan']);
    Route::post('/gui-tin-nhan', [TinNhanController::class, 'guiTinNhan']);
    Route::delete('/xoa-tin-nhan/{id}', [TinNhanController::class, 'xoaTinNhan']);
    Route::get('/cuoc-tro-chuyen/{ma_cuoc_tro_chuyen}', [TinNhanController::class, 'cuocTroChuyen']);

    // Admin/Dịch vụ
    Route::prefix('admin/goidichvu')->group(function () {
        Route::get('/', [GoiDichVuController::class, 'index']);      
        Route::post('/', [GoiDichVuController::class, 'store']);     
        Route::put('/{id}', [GoiDichVuController::class, 'update']); 
    }); 
});

/*
|--------------------------------------------------------------------------
| SYSTEM UTILITIES
|--------------------------------------------------------------------------
*/

// Route fix lỗi kẹt cache trên Render (Đã bỏ cache:clear để né lỗi DB)
Route::get('/clear-cache', function() {
    Artisan::call('config:clear');
    Artisan::call('route:clear');
    Artisan::call('view:clear');
    
    // Kiểm tra nhanh xem biến môi trường đã vào chưa
    $hasCloudinary = env('CLOUDINARY_URL') ? "ĐÃ NHẬN" : "CHƯA NHẬN";
    
    return response()->json([
        'status' => 'success',
        'message' => 'Cấu hình đã được nạp mới!',
        'cloudinary_status' => $hasCloudinary
    ]);
});