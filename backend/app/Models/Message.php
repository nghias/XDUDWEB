<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table = 'tin_nhan';

    protected $fillable = [
        'nguoi_gui_id',
        'nguoi_nhan_id',
        'noi_dung'
    ];
}