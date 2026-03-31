<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{

    // GET /api/tin-dang
    public function index()
    {
        return response()->json(Post::all());
    }

    // GET /api/tin-dang/{id}
    public function show($id)
    {
        $post = Post::find($id);

        if(!$post){
            return response()->json([
                "message"=>"Tin đăng không tồn tại"
            ],404);
        }

        return response()->json($post);
    }

    // POST /api/tin-dang
    public function store(Request $request)
    {
        $request->validate([
            'ma_chu_nha' => 'required|integer',
            'tieu_de' => 'required|string|max:255',
            'mo_ta' => 'required|string',
            'gia_thue' => 'required|numeric',
            'dien_tich' => 'required|numeric',
            'ma_loai_phong' => 'required|integer'
        ]);

        $post = Post::create($request->all());

        return response()->json([
            "message"=>"Đăng tin thành công",
            "data"=>$post
        ],201);
    }

}