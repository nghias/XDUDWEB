<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NguoiDung;

class NguoiDungController extends Controller
{

    public function tatCaNguoiDung()
    {
        return response()->json(NguoiDung::all());
    }

    public function chiTietNguoiDung($id)
    {
        return response()->json(NguoiDung::find($id));
    }

    public function taoNguoiDung(Request $request)
    {
        $user = NguoiDung::create($request->all());

        return response()->json($user);
    }

    public function capNhatNguoiDung(Request $request,$id)
    {
        $user = NguoiDung::find($id);

        $user->update($request->all());

        return response()->json($user);
    }

    public function xoaNguoiDung($id)
    {
        NguoiDung::destroy($id);

        return response()->json(["message"=>"deleted"]);
    }

}