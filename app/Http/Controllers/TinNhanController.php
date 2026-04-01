<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TinNhan;

class TinNhanController extends Controller
{

    // GET /api/tat-ca-tin-nhan
    public function tatCaTinNhan()
    {
        $tinNhan = TinNhan::orderBy('ngay_gui','desc')->get();

        return response()->json([
            "data"=>$tinNhan
        ]);
    }

    // GET /api/chi-tiet-tin-nhan/{id}
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

    // GET /api/cuoc-tro-chuyen/{ma_cuoc_tro_chuyen}
    public function cuocTroChuyen($ma_cuoc_tro_chuyen)
    {
        $tinNhan = TinNhan::where('ma_cuoc_tro_chuyen',$ma_cuoc_tro_chuyen)
            ->orderBy('ngay_gui','asc')
            ->get();

        return response()->json([
            "data"=>$tinNhan
        ]);
    }

    // POST /api/gui-tin-nhan
    public function guiTinNhan(Request $request)
    {
        $request->validate([
            'ma_cuoc_tro_chuyen'=>'required|numeric',
            'ma_nguoi_gui'=>'required|numeric',
            'noi_dung'=>'required|string'
        ]);

        $tinNhan = TinNhan::create([
            'ma_cuoc_tro_chuyen'=>$request->ma_cuoc_tro_chuyen,
            'ma_nguoi_gui'=>$request->ma_nguoi_gui,
            'noi_dung'=>$request->noi_dung,
            'da_doc'=>0
        ]);

        return response()->json([
            "message"=>"Gửi tin nhắn thành công",
            "data"=>$tinNhan
        ],201);
    }

    // DELETE /api/xoa-tin-nhan/{id}
    public function xoaTinNhan($id)
    {
        $tinNhan = TinNhan::find($id);

        if(!$tinNhan){
            return response()->json([
                "message"=>"Tin nhắn không tồn tại"
            ],404);
        }

        $tinNhan->delete();

        return response()->json([
            "message"=>"Xóa tin nhắn thành công"
        ]);
    }

}