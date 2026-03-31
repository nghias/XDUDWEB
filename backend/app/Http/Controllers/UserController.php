<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all());
    }

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
}