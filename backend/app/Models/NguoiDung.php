<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NguoiDung extends Model
{
    protected $table = 'nguoi_dung';

    public $timestamps = false;

    protected $fillable = [
        'email',
        'mat_khau',
        'ho_ten',
        'so_dien_thoai',
        'vai_tro',
        'anh_dai_dien',
        'trang_thai',
        'ngay_tao'
    ];

    protected $hidden = [
        'mat_khau'
    ];
}