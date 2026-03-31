<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = 'tin_dang';

    protected $fillable = [
        'tieu_de',
        'mo_ta',
        'gia',
        'dien_tich',
        'nguoi_dang_id',
        'loai_phong_id',
        'vi_tri_id'
    ];
}