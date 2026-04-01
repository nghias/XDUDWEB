<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NguoiDung;

class NguoiDungController extends Controller
{
    // GET /api/tat-ca-nguoi-dung
    public function tatCaNguoiDung()
    {
        return response()->json(NguoiDung::all());
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
        $request->validate([
            "ten"=>"required|string|max:255",
            "email"=>"required|email"
        ]);

        $nguoiDung = NguoiDung::create($request->all());

        return response()->json([
            "message"=>"Tạo người dùng thành công",
            "data"=>$nguoiDung
        ],201);
    }

    // PUT /api/cap-nhat-nguoi-dung/{id}
    public function capNhatNguoiDung(Request $request,$id)
    {
        $nguoiDung = NguoiDung::find($id);

        if(!$nguoiDung){
            return response()->json([
                "message"=>"Người dùng không tồn tại"
            ],404);
        }

        $nguoiDung->update($request->all());

        return response()->json([
            "message"=>"Cập nhật người dùng thành công",
            "data"=>$nguoiDung
        ]);
    }

    // DELETE /api/xoa-nguoi-dung/{id}
    public function xoaNguoiDung($id)
    {
        $nguoiDung = NguoiDung::find($id);

        if(!$nguoiDung){
            return response()->json([
                "message"=>"Người dùng không tồn tại"
            ],404);
        }

        $nguoiDung->delete();

        return response()->json([
            "message"=>"Xóa người dùng thành công"
        ]);
    }
}