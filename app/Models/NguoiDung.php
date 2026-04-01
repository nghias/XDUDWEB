<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NguoiDung extends Model
{
    protected $table = "nguoi_dung";

    protected $fillable = [
        "ten",
        "email",
        "mat_khau"
    ];

    protected $hidden = [
        "mat_khau"
    ];
}