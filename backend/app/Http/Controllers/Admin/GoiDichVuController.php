<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GoiDichVu;

class GoiDichVuController extends Controller
{
    // Lấy danh sách (Nên sắp xếp theo mức ưu tiên từ cao xuống thấp)
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

        // Validate dữ liệu truyền lên
        $request->validate([
            'ten_goi' => 'string|max:255',
            'gia_tien' => 'numeric',
            'thoi_han_ngay' => 'integer',
            'muc_uu_tien' => 'integer',
        ]);

        $goiDichVu->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật thành công!',
            'data' => $goiDichVu
        ], 200);
    }
}