<?php

namespace App\Http\Controllers;

use App\Models\DatPhong;
use Illuminate\Http\Request;

class DatPhongController extends Controller
{

    // POST /api/dat-phong
    public function datPhong(Request $request)
    {
        $datPhong = DatPhong::create([
            'ma_tin_dang'=>$request->ma_tin_dang,
            'ma_nguoi_dat'=>$request->ma_nguoi_dat,
            'ghi_chu'=>$request->ghi_chu,
            'ngay_dat'=>now(),
            'trang_thai'=>'cho_xac_nhan'
        ]);

        return response()->json([
            'message'=>'Đặt phòng thành công',
            'data'=>$datPhong
        ],201);
    }

    // GET /api/danh-sach-dat-phong
    public function danhSachDatPhong()
    {
        $data = DatPhong::with(['tinDang','nguoiDung'])
            ->orderBy('id','desc')
            ->get();

        return response()->json($data);
    }

    // GET /api/dat-phong-cua-toi/{id}
    public function datPhongCuaToi($ma_nguoi_dat)
    {
        $data = DatPhong::where('ma_nguoi_dat',$ma_nguoi_dat)
            ->with('tinDang')
            ->get();

        return response()->json($data);
    }

    // PUT /api/xac-nhan-dat-phong/{id}
    public function xacNhan($id)
    {
        $datPhong = DatPhong::find($id);

        if(!$datPhong){
            return response()->json([
                'message'=>'Không tìm thấy yêu cầu'
            ],404);
        }

        $datPhong->update([
            'trang_thai'=>'da_xac_nhan'
        ]);

        return response()->json([
            'message'=>'Đã xác nhận đặt phòng'
        ]);
    }

    // DELETE /api/huy-dat-phong/{id}
    public function huyDatPhong($id)
    {
        $datPhong = DatPhong::find($id);

        if(!$datPhong){
            return response()->json([
                'message'=>'Không tìm thấy yêu cầu'
            ],404);
        }

        $datPhong->delete();

        return response()->json([
            'message'=>'Đã hủy đặt phòng'
        ]);
    }

}