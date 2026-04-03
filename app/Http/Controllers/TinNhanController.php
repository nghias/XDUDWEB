<?php

namespace App\Http\Controllers;

use App\Models\TinNhan;

class TinNhanController extends Controller
{
    public function tatCaTinNhan()
    {
        return response()->json(TinNhan::all());
    }

    public function chiTietTinNhan($id)
    {
        $tinNhan = TinNhan::find($id);

        if(!$tinNhan){
            return response()->json([
                "message"=>"Tin nhắn không tồn tại"
            ],404);
        }

        return response()->json($tinNhan);
    }

    public function cuocTroChuyen($ma_cuoc_tro_chuyen)
    {
        $tinNhan = TinNhan::where('ma_cuoc_tro_chuyen',$ma_cuoc_tro_chuyen)
            ->orderBy('id','asc')
            ->get();

        return response()->json([
            "data"=>$tinNhan
        ]);
    }
}