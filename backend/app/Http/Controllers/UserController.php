<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // 1. Lấy danh sách tất cả người dùng
    public function index()
    {
        $users = User::all();
        return response()->json($users, 200);
    }

    // 2. Thêm mới một người dùng
    public function store(Request $request)
    {
        // Bạn có thể thêm validate ở đây
        $data = $request->all();
        
        // Mã hóa mật khẩu trước khi lưu
        if(isset($data['mat_khau'])) {
            $data['mat_khau'] = Hash::make($data['mat_khau']);
        }
        
        // Tự động gán ngày tạo nếu chưa có
        if(!isset($data['ngay_tao'])) {
            $data['ngay_tao'] = now();
        }

        $user = User::create($data);
        return response()->json(['message' => 'Tạo thành công', 'data' => $user], 201);
    }

    // 3. Lấy thông tin 1 người dùng cụ thể
    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng'], 404);
        }
        return response()->json($user, 200);
    }

    // 4. Cập nhật thông tin
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng'], 404);
        }

        $data = $request->all();
        
        // Nếu có cập nhật mật khẩu thì mã hóa lại
        if(isset($data['mat_khau'])) {
            $data['mat_khau'] = Hash::make($data['mat_khau']);
        }

        $user->update($data);
        return response()->json(['message' => 'Cập nhật thành công', 'data' => $user], 200);
    }

    // 5. Xóa người dùng
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'Xóa thành công'], 200);
    }
}