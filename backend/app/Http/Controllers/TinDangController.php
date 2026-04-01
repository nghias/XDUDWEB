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
        $tin = TinDang::with(['nguoiDung','viTri','loaiPhong'])
            ->orderBy('id','desc')
            ->get();

        return response()->json($tin);
    }

    // GET /api/chi-tiet-tin-dang/{id}
    public function chiTietTinDang($id)
    {
        $tin = TinDang::with(['nguoiDung','viTri','loaiPhong'])
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
        $tin = TinDang::create($request->validated());

        return response()->json([
            'message'=>'Tạo tin đăng thành công',
            'data'=>$tin
        ]);
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

}