<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HinhAnhTin;

class HinhAnhTinController extends Controller
{

// GET /api/anh-tin/{ma_tin_dang}
public function danhSachAnh($ma_tin_dang)
{
    $anh = HinhAnhTin::where('ma_tin_dang',$ma_tin_dang)->get();

    return response()->json([
        "data"=>$anh
    ]);
}


// POST /api/them-anh-tin
public function themAnh(Request $request)
{
    $request->validate([
        'ma_tin_dang'=>'required|numeric',
        'duong_dan_anh'=>'required|string',
        'la_anh_bia'=>'nullable|boolean'
    ]);

    $anh = HinhAnhTin::create([
        'ma_tin_dang'=>$request->ma_tin_dang,
        'duong_dan_anh'=>$request->duong_dan_anh,
        'la_anh_bia'=>$request->la_anh_bia ?? 0
    ]);

    return response()->json([
        "message"=>"Thêm ảnh thành công",
        "data"=>$anh
    ],201);
}


// PUT /api/cap-nhat-anh-tin/{id}
public function capNhatAnh(Request $request,$id)
{
    $anh = HinhAnhTin::find($id);

    if(!$anh){
        return response()->json([
            "message"=>"Ảnh không tồn tại"
        ],404);
    }

    $anh->update($request->all());

    return response()->json([
        "message"=>"Cập nhật ảnh thành công",
        "data"=>$anh
    ]);
}


// DELETE /api/xoa-anh-tin/{id}
public function xoaAnh($id)
{
    $anh = HinhAnhTin::find($id);

    if(!$anh){
        return response()->json([
            "message"=>"Ảnh không tồn tại"
        ],404);
    }

    $anh->delete();

    return response()->json([
        "message"=>"Xóa ảnh thành công"
    ]);
}

}