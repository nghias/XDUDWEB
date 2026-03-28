<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;

class MessageController extends Controller
{

    public function send(Request $request)
    {

        $message = Message::create([
            'sender_id'=>$request->sender_id,
            'receiver_id'=>$request->receiver_id,
            'post_id'=>$request->post_id,
            'content'=>$request->content
        ]);

        return response()->json([
            "message"=>"Message sent",
            "data"=>$message
        ]);
    }

    public function getMessages($user_id)
    {
        $messages = Message::where('sender_id',$user_id)
            ->orWhere('receiver_id',$user_id)
            ->get();

        return response()->json($messages);
    }

}