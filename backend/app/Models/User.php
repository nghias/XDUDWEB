<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'nguoi_dung';

    protected $fillable = [
        'ten',
        'email',
        'mat_khau',
        'so_dien_thoai'
    ];
}