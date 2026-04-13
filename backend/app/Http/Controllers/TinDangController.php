<?php

namespace App\Http\Controllers;

use App\Models\TinDang;
use Illuminate\Http\Request;
use App\Http\Requests\TaoTinDangRequest;

class TinDangController extends Controller
{

    // GET /api/tat-ca-tin-dang
    public function tatCaTinDang()
    {
        $tin = TinDang::with(['nguoiDung', 'hinhAnh', 'loaiPhong'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($tin);
    }

    // GET /api/chi-tiet-tin-dang/{id}
    public function chiTietTinDang($id)
    {
        $tin = TinDang::with(['nguoiDung', 'hinhAnh', 'loaiPhong'])
            ->find($id);

        if (!$tin) {
            return response()->json([
                'message' => 'Tin đăng không tồn tại'
            ], 404);
        }

        return response()->json($tin);
    }

    // POST /api/tao-tin-dang
    public function taoTinDang(TaoTinDangRequest $request)
    {
        $data = $request->validated();

        $data['trang_thai'] = 'hoat_dong';
        $data['luot_xem'] = 0;
        $data['ngay_dang'] = now();

        $tin = TinDang::create($data);

        return response()->json([
            'message' => 'Tạo tin đăng thành công',
            'data' => $tin
        ], 201);
    }

    // GET /api/tin-dang-cua-toi/{ma_chu_nha}
    public function tinDangCuaToi($ma_chu_nha)
    {
        $tinDang = TinDang::where('ma_chu_nha', $ma_chu_nha)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            "data" => $tinDang
        ]);
    }
    // PUT /api/cap-nhat-tin-dang/{id}
    public function capNhatTinDang(Request $request, $id)
    {
        $tin = TinDang::find($id);

        if (!$tin) {
            return response()->json([
                "message" => "Tin đăng không tồn tại"
            ], 404);
        }

        $tin->update($request->all());

        return response()->json([
            "message" => "Cập nhật tin đăng thành công",
            "data" => $tin
        ]);
    }
    // DELETE /api/xoa-tin-dang/{id}
    public function xoaTinDang($id)
    {
        $tin = TinDang::find($id);

        if (!$tin) {
            return response()->json([
                "message" => "Tin đăng không tồn tại"
            ], 404);
        }

        $tin->delete();

        return response()->json([
            "message" => "Xóa tin đăng thành công"
        ]);
    }
    public function timKiemNangCao(Request $request)
    {
        // Khởi tạo query lấy các tin đăng (kèm theo các thông tin liên quan)
        $query = TinDang::with(['nguoiDung', 'hinhAnh', 'loaiPhong', 'viTri'])
            ->where('trang_thai', 'hoat_dong'); // Chỉ tìm các tin đang hoạt động

        // 1. Tìm theo TỪ KHÓA (Tiêu đề, Mô tả hoặc chi tiết địa chỉ)
        if ($request->filled('tu_khoa')) {
            $tuKhoa = $request->tu_khoa;
            $query->where(function ($q) use ($tuKhoa) {
                // MySQL utf8mb4_unicode_ci sẽ tự động xử lý vụ không dấu & hoa thường
                $q->where('tieu_de', 'LIKE', "%{$tuKhoa}%")
                    ->orWhere('mo_ta', 'LIKE', "%{$tuKhoa}%")
                    ->orWhereHas('viTri', function ($qViTri) use ($tuKhoa) {
                        $qViTri->where('dia_chi_chi_tiet', 'LIKE', "%{$tuKhoa}%")
                            ->orWhere('ten_duong', 'LIKE', "%{$tuKhoa}%");
                    });
            });
        }

        // 2. Tìm theo DIỆN TÍCH (từ ... đến ...)
        if ($request->filled('dien_tich_tu')) {
            $query->where('dien_tich', '>=', $request->dien_tich_tu);
        }
        if ($request->filled('dien_tich_den')) {
            $query->where('dien_tich', '<=', $request->dien_tich_den);
        }

        // 3. Tìm theo GIÁ THUÊ (từ ... đến ...)
        if ($request->filled('gia_tu')) {
            $query->where('gia_thue', '>=', $request->gia_tu);
        }
        if ($request->filled('gia_den')) {
            $query->where('gia_thue', '<=', $request->gia_den);
        }

        // 4. Tìm theo LOẠI PHÒNG
        if ($request->filled('ma_loai_phong')) {
            $query->where('ma_loai_phong', $request->ma_loai_phong);
        }

        // 5. Tìm theo VỊ TRÍ CHÍNH XÁC (Tỉnh/Thành, Quận/Huyện, Phường/Xã)
        if ($request->filled('tinh_thanh_pho') || $request->filled('quan_huyen') || $request->filled('phuong_xa')) {
            $query->whereHas('viTri', function ($qViTri) use ($request) {
                if ($request->filled('tinh_thanh_pho')) {
                    $qViTri->where('tinh_thanh_pho', 'LIKE', "%{$request->tinh_thanh_pho}%");
                }
                if ($request->filled('quan_huyen')) {
                    $qViTri->where('quan_huyen', 'LIKE', "%{$request->quan_huyen}%");
                }
                if ($request->filled('phuong_xa')) {
                    $qViTri->where('phuong_xa', 'LIKE', "%{$request->phuong_xa}%");
                }
            });
        }

        // Thực thi query, sắp xếp theo tin mới nhất
        $ketQua = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'message' => 'Tìm kiếm thành công',
            'tong_so_luong' => $ketQua->count(),
            'data' => $ketQua
        ], 200);
    }
}
