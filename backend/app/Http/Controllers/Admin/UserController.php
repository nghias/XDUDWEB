<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User; // Đảm bảo đã import Model
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        // 1. Thử trả về một chuỗi text đơn giản trước để test kết nối
        // return "Kết nối Controller thành công!"; 

        // 2. Lấy dữ liệu (Nhớ thêm \App\Models\ nếu chưa import)
        $users = User::all();

        // 3. Bắt buộc phải có RETURN và định dạng JSON
        return response()->json([
            'status' => 'success',
            'message' => 'Da ket noi den Controller Admin',
            'data' => $users
        ], 200);
    }

   public function toggleStatus($id)
{
    $user = \App\Models\User::find($id);
    if (!$user) {
        return response()->json(['message' => 'Không tìm thấy người dùng'], 404);
    }

    // Đã sửa 'bi_khoa' thành 'khoa' cho khớp với Database
    $user->trang_thai = ($user->trang_thai == 'hoat_dong') ? 'khoa' : 'hoat_dong';
    
    $user->save();

    return response()->json([
        'status' => 'success',
        'message' => 'Đã đổi trạng thái thành: ' . $user->trang_thai,
        'new_status' => $user->trang_thai
    ], 200);
}
}