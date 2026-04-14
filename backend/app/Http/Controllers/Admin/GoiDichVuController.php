<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GoiDichVu;

class GoiDichVuController extends Controller
{
    // Lấy danh sách 
    public function index()
    {
        $danhSachGoi = GoiDichVu::orderBy('muc_uu_tien', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $danhSachGoi
        ], 200);
    }

    // Thêm mới gói dịch vụ
    public function store(Request $request)
    {
        $request->validate([
            'ten_goi' => 'required|string|max:255',
            'gia_tien' => 'required|numeric',
            'thoi_han_ngay' => 'required|integer',
            'muc_uu_tien' => 'required|integer',
            // Thêm validate cho 3 trường mới
            'so_tin_toi_da' => 'nullable|integer',
            'noi_bat' => 'nullable|boolean',
            'mo_ta' => 'nullable|string',
        ]);

        $goiMoi = GoiDichVu::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Thêm gói dịch vụ thành công!',
            'data' => $goiMoi
        ], 201);
    }

    // Cập nhật gói dịch vụ
    public function update(Request $request, $id)
    {
        $goiDichVu = GoiDichVu::find($id);
        
        if (!$goiDichVu) {
            return response()->json(['message' => 'Không tìm thấy gói dịch vụ'], 404);
        }

        $request->validate([
            'ten_goi' => 'string|max:255',
            'gia_tien' => 'numeric',
            'thoi_han_ngay' => 'integer',
            'muc_uu_tien' => 'integer',
            // Thêm validate cho 3 trường mới
            'so_tin_toi_da' => 'nullable|integer',
            'noi_bat' => 'nullable|boolean',
            'mo_ta' => 'nullable|string',
        ]);

        $goiDichVu->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật thành công!',
            'data' => $goiDichVu
        ], 200);
    }

    // Xóa gói dịch vụ (Bổ sung thêm hàm xóa để React gọi không bị lỗi 404)
    public function destroy($id)
    {
        $goiDichVu = GoiDichVu::find($id);
        if (!$goiDichVu) {
            return response()->json(['message' => 'Không tìm thấy gói dịch vụ'], 404);
        }
        $goiDichVu->delete();
        return response()->json(['message' => 'Xóa thành công!'], 200);
    }
}