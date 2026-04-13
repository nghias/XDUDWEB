<?php

namespace App\Http\Controllers;

use App\Models\NguoiDung;
use Illuminate\Http\Request;

class NguoiDungController extends Controller
{

    // GET /api/tat-ca-nguoi-dung
    public function tatCaNguoiDung()
    {

        $nguoiDung = NguoiDung::orderBy('id','desc')->get();

        return response()->json($nguoiDung);

    }


    // GET /api/chi-tiet-nguoi-dung/{id}
    public function chiTietNguoiDung($id)
    {

        $nguoiDung = NguoiDung::find($id);

        if(!$nguoiDung){

            return response()->json([
                "message"=>"Người dùng không tồn tại"
            ],404);

        }

        return response()->json($nguoiDung);

    }


    // POST /api/tao-nguoi-dung
    public function taoNguoiDung(Request $request)
    {

        $nguoiDung = NguoiDung::create([

            'ho_ten'=>$request->ho_ten,
            'email'=>$request->email,
            'mat_khau'=>$request->mat_khau,
            'so_dien_thoai'=>$request->so_dien_thoai,
            'vai_tro'=>'user',
            'ngay_tao'=>now()

        ]);

        return response()->json([

            "message"=>"Tạo người dùng thành công",
            "data"=>$nguoiDung

        ]);

    }


    // PUT /api/cap-nhat-nguoi-dung/{id}
    public function capNhatNguoiDung(Request $request,$id)
    {

        $nguoiDung = NguoiDung::find($id);

        if(!$nguoiDung){

            return response()->json([
                "message"=>"Không tìm thấy người dùng"
            ],404);

        }

        $nguoiDung->update($request->all());

        return response()->json([

            "message"=>"Cập nhật thành công",
            "data"=>$nguoiDung

        ]);

    }


    // DELETE /api/xoa-nguoi-dung/{id}
    public function xoaNguoiDung($id)
    {

        $nguoiDung = NguoiDung::find($id);

        if(!$nguoiDung){

            return response()->json([
                "message"=>"Không tìm thấy người dùng"
            ],404);

        }

        $nguoiDung->delete();

        return response()->json([

            "message"=>"Xóa người dùng thành công"

        ]);

    }

}