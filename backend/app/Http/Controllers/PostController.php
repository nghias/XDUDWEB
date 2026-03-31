<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{
    // GET /api/posts
    public function index()
    {
        return response()->json(Post::all());
    }

    // GET /api/posts/{id}
    public function show($id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                "message" => "Tin đăng không tồn tại"
            ],404);
        }

        return response()->json($post);
    }

    // POST /api/posts (đăng tin)
    public function store(Request $request)
    {
        $request->validate([
            'tieu_de' => 'required|string|max:255',
            'mo_ta' => 'required|string',
            'gia' => 'required|numeric',
            'dien_tich' => 'required|numeric',
            'nguoi_dang_id' => 'required|numeric',
            'loai_phong_id' => 'required|numeric',
            'vi_tri_id' => 'required|numeric'
        ]);

        $post = Post::create($request->all());

        return response()->json([
            "message" => "Đăng tin thành công",
            "data" => $post
        ],201);
    }

    // PUT /api/posts/{id}
    public function update(Request $request,$id)
    {
        $post = Post::find($id);

        if(!$post){
            return response()->json([
                "message"=>"Tin đăng không tồn tại"
            ],404);
        }

        $post->update($request->all());

        return response()->json([
            "message"=>"Cập nhật tin thành công",
            "data"=>$post
        ]);
    }

    // DELETE /api/posts/{id}
    public function destroy($id)
    {
        $post = Post::find($id);

        if(!$post){
            return response()->json([
                "message"=>"Tin đăng không tồn tại"
            ],404);
        }

        $post->delete();

        return response()->json([
            "message"=>"Xóa tin thành công"
        ]);
    }
}