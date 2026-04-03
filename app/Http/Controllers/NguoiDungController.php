<?php

namespace App\Http\Controllers;

use App\Models\NguoiDung;

class NguoiDungController extends Controller
{
    public function tatCaNguoiDung()
    {
        return response()->json(NguoiDung::all());
    }

    public function chiTietNguoiDung($id)
    {
        $user = NguoiDung::find($id);

        if(!$user){
            return response()->json([
                "message"=>"Không tìm thấy người dùng"
            ],404);
        }

        return response()->json($user);
    }
}