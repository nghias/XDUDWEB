<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TinDang;
use Illuminate\Http\Request;

class TinDangController extends Controller
{
  public function index()
{
    // Lấy danh sách tin đăng, có thể kèm thông tin người đăng (user)
    $tinDang = \App\Models\TinDang::all(); 

    return response()->json([
        'status' => 'success',
        'message' => 'Lấy danh sách tin đăng thành công',
        'data' => $tinDang
    ], 200);
}
//duyet tin
   public function duyetTin(Request $request, $id)
{
    $tin = \App\Models\TinDang::find($id);
    if (!$tin) {
        return response()->json(['status' => 'error', 'message' => 'Tin đăng không tồn tại'], 404);
    }

    // Validate: Bắt buộc phải là chữ (string)
    $request->validate([
        'trang_thai' => 'required|string' 
    ]);

    $tin->trang_thai = $request->trang_thai;
    $tin->save();

    return response()->json([
        'status' => 'success',
        'message' => 'Đã cập nhật trạng thái tin đăng thành: ' . $tin->trang_thai,
        'data' => $tin
    ], 200);
}

    // Xóa tin đăng vi phạm
    public function destroy($id)
    {
        $tin = TinDang::find($id);
        if (!$tin) {
            return response()->json(['success' => false, 'message' => 'Tin đăng không tồn tại'], 404);
        }

        $tin->delete();
        return response()->json([
            'success' => true,
            'message' => 'Đã xóa tin đăng'
        ], 200);
    }
}