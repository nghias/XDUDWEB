<?php

namespace App\Http\Controllers;

use App\Models\TinDang;
use Illuminate\Http\Request;
use App\Http\Requests\TaoTinDangRequest;

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
    public function chiTietTinDang($id)
    {
        $tin = TinDang::with(['nguoiDung','hinhAnh','loaiPhong'])
            ->find($id);

        if(!$tin){
            return response()->json([
                'message'=>'Tin đăng không tồn tại'
            ],404);
        }

        return response()->json($tin);
    }

    // POST /api/tao-tin-dang
public function taoTinDang(TaoTinDangRequest $request)
{
    $data = $request->validated();

    $data['trang_thai'] = 'hoat_dong';
    $data['luot_xem'] = 0;
    $data['ngay_dang'] = now();

    $tin = TinDang::create($data);

    return response()->json([
        'message'=>'Tạo tin đăng thành công',
        'data'=>$tin
    ],201);
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
// PUT /api/cap-nhat-tin-dang/{id}
public function capNhatTinDang(Request $request, $id)
{
    $tin = TinDang::find($id);

    if(!$tin){
        return response()->json([
            "message"=>"Tin đăng không tồn tại"
        ],404);
    }

    $tin->update($request->all());

    return response()->json([
        "message"=>"Cập nhật tin đăng thành công",
        "data"=>$tin
    ]);
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

    $tin->delete();

    return response()->json([
        "message"=>"Xóa tin đăng thành công"
    ]);
}
}