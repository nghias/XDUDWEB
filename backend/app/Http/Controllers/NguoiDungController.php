<?php

namespace App\Http\Controllers;

use App\Models\NguoiDung;
use Illuminate\Http\Request;

class NguoiDungController extends Controller
{

    // GET /api/tat-ca-nguoi-dung
    public function tatCaNguoiDung()
    {

        $nguoiDung = NguoiDung::orderBy('id', 'desc')->get();

        return response()->json($nguoiDung);
    }


    // GET /api/chi-tiet-nguoi-dung/{id}
    public function chiTietNguoiDung($id)
    {

        $nguoiDung = NguoiDung::find($id);

        if (!$nguoiDung) {

            return response()->json([
                "message" => "Người dùng không tồn tại"
            ], 404);
        }

        return response()->json($nguoiDung);
    }


    // POST /api/tao-nguoi-dung
    public function taoNguoiDung(Request $request)
    {

        $nguoiDung = NguoiDung::create([

            'ho_ten' => $request->ho_ten,
            'email' => $request->email,
            'mat_khau' => $request->mat_khau,
            'so_dien_thoai' => $request->so_dien_thoai,
            'vai_tro' => 'user',
            'ngay_tao' => now()

        ]);

        return response()->json([

            "message" => "Tạo người dùng thành công",
            "data" => $nguoiDung

        ]);
    }


    // PUT /api/cap-nhat-nguoi-dung/{id}
    public function capNhatNguoiDung(Request $request, $id)
    {

        $nguoiDung = NguoiDung::find($id);

        if (!$nguoiDung) {

            return response()->json([
                "message" => "Không tìm thấy người dùng"
            ], 404);
        }

        $nguoiDung->update($request->all());

        return response()->json([

            "message" => "Cập nhật thành công",
            "data" => $nguoiDung

        ]);
    }


    // DELETE /api/xoa-nguoi-dung/{id}
    public function xoaNguoiDung($id)
    {

        $nguoiDung = NguoiDung::find($id);

        if (!$nguoiDung) {

            return response()->json([
                "message" => "Không tìm thấy người dùng"
            ], 404);
        }

        $nguoiDung->delete();

        return response()->json([

            "message" => "Xóa người dùng thành công"

        ]);
    }

    public function capNhatThongTinCaNhan(Request $request)
    {
        // 1. Lấy thông tin user đang đăng nhập thông qua Token (Sanctum)
        $user = $request->user();

        // 2. (Tùy chọn) Validate dữ liệu gửi lên
        $request->validate([
            'ho_ten' => 'sometimes|string|max:100',
            // Đảm bảo số điện thoại không trùng với người khác (ngoại trừ chính user này)
            'so_dien_thoai' => 'sometimes|string|max:20|unique:nguoi_dung,so_dien_thoai,' . $user->id,
            'anh_dai_dien' => 'sometimes|string',
        ], [
            'so_dien_thoai.unique' => 'Số điện thoại này đã được sử dụng bởi người khác.'
        ]);

        // 3. Chỉ lấy những trường được phép cập nhật để bảo mật (tránh lỗi leo thang đặc quyền đổi vai_tro)
        $dataToUpdate = $request->only(['ho_ten', 'so_dien_thoai', 'anh_dai_dien']);

        // 4. Cập nhật thông tin vào database
        // Lưu ý: $user lúc này là object của Model User (đã được lấy từ Sanctum)
        $user->update($dataToUpdate);

        return response()->json([
            "message" => "Cập nhật thông tin cá nhân thành công",
            "data" => $user
        ]);
    }
}
