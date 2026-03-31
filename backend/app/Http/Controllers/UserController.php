<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    // GET /api/users
    public function index()
    {
        return response()->json(User::all());
    }

    // GET /api/users/{id}
    public function show($id)
    {
        $user = User::find($id);

        if(!$user){
            return response()->json([
                "message"=>"User không tồn tại"
            ],404);
        }

        return response()->json($user);
    }

    // POST /api/users
    public function store(Request $request)
    {
        $request->validate([
            "ten"=>"required|string|max:255",
            "email"=>"required|email"
        ]);

        $user = User::create($request->all());

        return response()->json([
            "message"=>"Tạo user thành công",
            "data"=>$user
        ],201);
    }

    // PUT /api/users/{id}
    public function update(Request $request,$id)
    {
        $user = User::find($id);

        if(!$user){
            return response()->json([
                "message"=>"User không tồn tại"
            ],404);
        }

        $user->update($request->all());

        return response()->json([
            "message"=>"Cập nhật user thành công",
            "data"=>$user
        ]);
    }

    // DELETE /api/users/{id}
    public function destroy($id)
    {
        $user = User::find($id);

        if(!$user){
            return response()->json([
                "message"=>"User không tồn tại"
            ],404);
        }

        $user->delete();

        return response()->json([
            "message"=>"Xóa user thành công"
        ]);
    }
}