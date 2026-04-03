<?php

namespace App\Http\Controllers;

use App\Models\TinDang;

class TinDangController extends Controller
{
    public function tatCaTinDang()
    {
        return response()->json(TinDang::all());
    }

    public function chiTietTinDang($id)
    {
        $tin = TinDang::find($id);

        if(!$tin){
            return response()->json([
                "message"=>"Tin đăng không tồn tại"
            ],404);
        }

        return response()->json($tin);
    }

    public function tinDangCuaToi($ma_chu_nha)
    {
        $tin = TinDang::where('ma_chu_nha',$ma_chu_nha)
            ->orderBy('id','desc')
            ->get();

        return response()->json([
            "data"=>$tin
        ]);
    }
}