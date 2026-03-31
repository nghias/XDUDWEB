<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{
    public function index()
    {
        return response()->json(Post::all());
    }

    public function show($id)
    {
        return response()->json(Post::find($id));
    }

    public function store(Request $request)
    {
        $post = Post::create($request->all());
        return response()->json($post);
    }

    public function update(Request $request,$id)
    {
        $post = Post::find($id);

        if(!$post){
            return response()->json(["message"=>"Not found"]);
        }

        $post->update($request->all());

        return response()->json($post);
    }

    public function destroy($id)
    {
        Post::destroy($id);

        return response()->json(["message"=>"deleted"]);
    }
}