<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = 'tin_dang';

    protected $fillable = [
        'ma_chu_nha',
        'tieu_de',
        'mo_ta',
        'gia_thue',
        'dien_tich',
        'ma_loai_phong',
        'trang_thai',
        'luot_xem',
        'ngay_dang'
    ];

    public $timestamps = false;
}