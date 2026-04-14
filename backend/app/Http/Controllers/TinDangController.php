<?php

namespace App\Http\Controllers;

use App\Models\TinDang;
use App\Models\HinhAnhTin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TinDangController extends Controller
{

    // GET /api/tat-ca-tin-dang
    public function tatCaTinDang()
    {
        $tin = TinDang::with(['nguoiDung','hinhAnh','loaiPhong'])
            ->orderBy('id','desc')
            ->get();

        return response()->json($tin);
    }

    // GET /api/chi-tiet-tin-dang/{id}
    public function chiTietTinDang($id) {
        // Đã bổ sung thêm 'nguoiDung' vào danh sách kéo theo
        $tin = TinDang::with(['viTri', 'loaiPhong', 'hinhAnh', 'tienIch', 'nguoiDung'])->find($id);
        
        if(!$tin) return response()->json(['message' => 'Không tìm thấy'], 404);
        
        return response()->json($tin);
    }
        
    // GET /api/tin-dang-cua-toi/{ma_chu_nha}
    public function tinDangCuaToi($ma_chu_nha)
    {
        $tinDang = TinDang::where('ma_chu_nha',$ma_chu_nha)
            ->orderBy('id','desc')
            ->get();

        return response()->json([
            "data"=>$tinDang
        ]);
    }

    // POST /api/tao-tin-dang
    public function taoTinDang(Request $request)
    {
        DB::beginTransaction();
        try {
            // 1. Tạo tin đăng
            $tin = TinDang::create([
                'ma_chu_nha'    => $request->ma_chu_nha ?? 1,
                'tieu_de'       => $request->tieu_de,
                'mo_ta'         => $request->mo_ta,
                'gia_thue'      => (float)$request->gia_thue,
                'dien_tich'     => (float)$request->dien_tich,
                'ma_loai_phong' => (int)$request->ma_loai_phong,
                'trang_thai'    => 'hoat_dong',
                'luot_xem'      => 0,
                'ngay_dang'     => now()
            ]);

            // 2. Tạo vị trí liên kết
            DB::table('vi_tri')->insert([
                'ma_tin_dang'      => $tin->id,
                'tinh_thanh_pho'   => $request->tinh_thanh_pho,
                'quan_huyen'       => $request->quan_huyen,
                'phuong_xa'        => $request->phuong_xa,
                'ten_duong'        => $request->ten_duong,
                'dia_chi_chi_tiet' => $request->dia_chi_chi_tiet,
                'vi_do'            => 0, 
                'kinh_do'          => 0
            ]);

            // 3. Lưu tiện ích
            if ($request->has('tien_ich') && is_array($request->tien_ich)) {
                foreach ($request->tien_ich as $maTienIch) {
                    DB::table('tien_ich_tin_dang')->insert([
                        'ma_tin_dang' => $tin->id,
                        'ma_tien_ich' => (int)$maTienIch
                    ]);
                }
            }

            // 4. Upload ảnh lên Cloudinary (DÙNG SDK TRỰC TIẾP ĐỂ KHÔNG BỊ LỖI CONFIG)
            if ($request->hasFile('hinh_anh')) {
                // Khởi tạo trực tiếp bằng biến môi trường (Bỏ qua file config)
                $cloudinary = new \Cloudinary\Cloudinary([
                    'cloud' => [
                        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                        'api_key'    => env('CLOUDINARY_API_KEY'),
                        'api_secret' => env('CLOUDINARY_API_SECRET'),
                    ],
                ]);

                foreach ($request->file('hinh_anh') as $index => $file) {
                    // Upload file thẳng lên Cloudinary
                    $uploadResult = $cloudinary->uploadApi()->upload($file->getRealPath(), [
                        'folder' => 'timtro_duan'
                    ]);
                    
                    $url = $uploadResult['secure_url'];

                    DB::table('hinh_anh_tin')->insert([
                        'ma_tin_dang'   => $tin->id,
                        'duong_dan_anh' => $url,
                        'la_anh_bia'    => $index === 0 ? 1 : 0 
                    ]);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Đăng tin thành công!', 'data' => $tin], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }

    // PUT /api/cap-nhat-tin-dang/{id}
    public function capNhatTinDang(Request $request, $id)
    {
        $tin = TinDang::find($id);
        if (!$tin) return response()->json(["message" => "Không tìm thấy tin"], 404);

        DB::beginTransaction();
        try {
            // Cập nhật thông tin cơ bản
            $tin->update([
                'tieu_de'       => $request->tieu_de,
                'mo_ta'         => $request->mo_ta,
                'gia_thue'      => (float)$request->gia_thue,
                'dien_tich'     => (float)$request->dien_tich,
                'ma_loai_phong' => (int)$request->ma_loai_phong,
                'trang_thai'    => $request->trang_thai
            ]);

            // Cập nhật vị trí
            DB::table('vi_tri')->where('ma_tin_dang', $id)->update([
                'tinh_thanh_pho'   => $request->tinh_thanh_pho,
                'quan_huyen'       => $request->quan_huyen,
                'phuong_xa'        => $request->phuong_xa,
                'ten_duong'        => $request->ten_duong,
                'dia_chi_chi_tiet' => $request->dia_chi_chi_tiet
            ]);

            // Cập nhật tiện ích (Xóa cũ thêm mới)
            DB::table('tien_ich_tin_dang')->where('ma_tin_dang', $id)->delete();
            if ($request->has('tien_ich') && is_array($request->tien_ich)) {
                foreach ($request->tien_ich as $maTienIch) {
                    DB::table('tien_ich_tin_dang')->insert([
                        'ma_tin_dang' => $id, 
                        'ma_tien_ich' => (int)$maTienIch
                    ]);
                }
            }

            // Cập nhật hình ảnh (DÙNG SDK TRỰC TIẾP)
            if ($request->hasFile('hinh_anh')) {
                DB::table('hinh_anh_tin')->where('ma_tin_dang', $id)->delete();
                
                // Khởi tạo trực tiếp bằng biến môi trường
                $cloudinary = new \Cloudinary\Cloudinary([
                    'cloud' => [
                        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                        'api_key'    => env('CLOUDINARY_API_KEY'),
                        'api_secret' => env('CLOUDINARY_API_SECRET'),
                    ],
                ]);

                foreach ($request->file('hinh_anh') as $index => $file) {
                    $uploadResult = $cloudinary->uploadApi()->upload($file->getRealPath(), [
                        'folder' => 'timtro_duan'
                    ]);
                    
                    $url = $uploadResult['secure_url'];
                    
                    DB::table('hinh_anh_tin')->insert([
                        'ma_tin_dang'   => $id,
                        'duong_dan_anh' => $url,
                        'la_anh_bia'    => $index === 0 ? 1 : 0 
                    ]);
                }
            }

            DB::commit();
            return response()->json(["message" => "Cập nhật thành công!"]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi cập nhật: ' . $e->getMessage()], 500);
        }
    }
    // DELETE /api/xoa-tin-dang/{id}
    public function xoaTinDang($id)
    {
        $tin = TinDang::find($id);

        if(!$tin){
            return response()->json([
                "message"=>"Tin đăng không tồn tại"
            ],404);
        }

        // xóa ảnh liên quan
        HinhAnhTin::where('ma_tin_dang',$id)->delete();

        // xóa tin
        $tin->delete();

        return response()->json([
            "message"=>"Xóa tin đăng thành công"
        ]);
    }

    // GET /api/tim-kiem-tin-dang
    public function timKiemNangCao(Request $request)
    {
        // Khởi tạo query lấy các tin đăng (kèm theo các thông tin liên quan)
        $query = TinDang::with(['nguoiDung','hinhAnh','loaiPhong','viTri'])
            ->where('trang_thai','hoat_dong');

        // 1. Tìm theo TỪ KHÓA (Tiêu đề, Mô tả hoặc chi tiết địa chỉ)
        if ($request->filled('tu_khoa')) {

            $tuKhoa = $request->tu_khoa;

            $query->where(function ($q) use ($tuKhoa) {
            // MySQL utf8mb4_unicode_ci sẽ tự động xử lý vụ không dấu & hoa thường
                $q->where('tieu_de','LIKE',"%{$tuKhoa}%")
                  ->orWhere('mo_ta','LIKE',"%{$tuKhoa}%")
                  ->orWhereHas('viTri', function ($qViTri) use ($tuKhoa) {

                        $qViTri->where('dia_chi_chi_tiet','LIKE',"%{$tuKhoa}%")
                               ->orWhere('ten_duong','LIKE',"%{$tuKhoa}%");

                  });

            });

        }

        // 2. Tìm theo DIỆN TÍCH (từ ... đến ...)
        if ($request->filled('dien_tich_tu')) {
            $query->where('dien_tich','>=',$request->dien_tich_tu);
        }

        if ($request->filled('dien_tich_den')) {
            $query->where('dien_tich','<=',$request->dien_tich_den);
        }

        // 3. Tìm theo GIÁ THUÊ (từ ... đến ...)
        if ($request->filled('gia_tu')) {
            $query->where('gia_thue','>=',$request->gia_tu);
        }

        if ($request->filled('gia_den')) {
            $query->where('gia_thue','<=',$request->gia_den);
        }

        // 4. Tìm theo LOẠI PHÒNG
        if ($request->filled('ma_loai_phong')) {
            $query->where('ma_loai_phong',$request->ma_loai_phong);
        }

        // 5. Tìm theo VỊ TRÍ CHÍNH XÁC (Tỉnh/Thành, Quận/Huyện, Phường/Xã)
        if ($request->filled('tinh_thanh_pho') ||
            $request->filled('quan_huyen') ||
            $request->filled('phuong_xa')) {

            $query->whereHas('viTri', function ($qViTri) use ($request) {

                if ($request->filled('tinh_thanh_pho')) {
                    $qViTri->where('tinh_thanh_pho','LIKE',"%{$request->tinh_thanh_pho}%");
                }

                if ($request->filled('quan_huyen')) {
                    $qViTri->where('quan_huyen','LIKE',"%{$request->quan_huyen}%");
                }

                if ($request->filled('phuong_xa')) {
                    $qViTri->where('phuong_xa','LIKE',"%{$request->phuong_xa}%");
                }

            });
        }
        // Thực thi query, sắp xếp theo tin mới nhất
        $ketQua = $query->orderBy('id','desc')->get();

        return response()->json([
            'message'=>'Tìm kiếm thành công',
            'tong_so_luong'=>$ketQua->count(),
            'data'=>$ketQua
        ],200);
    }

}