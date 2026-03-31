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
            'nguoi_gui_id'=>'required|numeric',
            'nguoi_nhan_id'=>'required|numeric',
            'noi_dung'=>'required|string'
        ]);

        $message = Message::create([
            'nguoi_gui_id'=>$request->nguoi_gui_id,
            'nguoi_nhan_id'=>$request->nguoi_nhan_id,
            'noi_dung'=>$request->noi_dung
        ]);

        return response()->json([
            "message"=>"Gửi tin nhắn thành công",
            "data"=>$message
        ],201);
    }

    // DELETE /api/messages/{id}
    public function destroy($id)
    {
        $message = Message::find($id);

        if(!$message){
            return response()->json([
                "message"=>"Tin nhắn không tồn tại"
            ],404);
        }

        $message->delete();

        return response()->json([
            "message"=>"Xóa tin nhắn thành công"
        ]);
    }
}