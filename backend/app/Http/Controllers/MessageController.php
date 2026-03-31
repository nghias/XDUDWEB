<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;

class MessageController extends Controller
{
    // GET /api/messages
    public function index()
    {
        return response()->json(Message::all());
    }

    // GET /api/messages/{id}
    public function show($id)
    {
        $message = Message::find($id);

        if(!$message){
            return response()->json([
                "message"=>"Tin nhắn không tồn tại"
            ],404);
        }

        return response()->json($message);
    }

    // POST /api/messages
    public function store(Request $request)
    {
        $request->validate([
            'sender_id'=>'required|numeric',
            'receiver_id'=>'required|numeric',
            'post_id'=>'required|numeric',
            'content'=>'required|string'
        ]);

        $message = Message::create($request->all());

        return response()->json([
            "message"=>"Gửi tin nhắn thành công",
            "data"=>$message
        ],201);
    }

    // DELETE /api/messages/{id}
    public function destroy($id)
    {
        Message::destroy($id);

        return response()->json([
            "message"=>"Xóa tin nhắn thành công"
        ]);
    }
}