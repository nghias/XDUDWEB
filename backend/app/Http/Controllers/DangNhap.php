<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NguoiDung;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // POST /api/dang-ky
    public function dangKy(Request $request)
    {
        $request->validate([
            "ten"=>"required|string|max:255",
            "email"=>"required|email|unique:nguoi_dung,email",
            "mat_khau"=>"required|min:6"
        ]);

        $nguoiDung = NguoiDung::create([
            "ten"=>$request->ten,
            "email"=>$request->email,
            "mat_khau"=>Hash::make($request->mat_khau)
        ]);

        return response()->json([
            "message"=>"Đăng ký thành công",
            "data"=>$nguoiDung
        ],201);
    }

    // POST /api/dang-nhap
    public function dangNhap(Request $request)
    {
        $request->validate([
            "email"=>"required|email",
            "mat_khau"=>"required"
        ]);

        $nguoiDung = NguoiDung::where("email",$request->email)->first();

        if(!$nguoiDung || !Hash::check($request->mat_khau,$nguoiDung->mat_khau)){
            return response()->json([
                "message"=>"Email hoặc mật khẩu không đúng"
            ],401);
        }

        return response()->json([
            "message"=>"Đăng nhập thành công",
            "data"=>$nguoiDung
        ]);
    }
}