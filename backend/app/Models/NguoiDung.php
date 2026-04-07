<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NguoiDung extends Model
{
    protected $table = 'nguoi_dung';

    protected $primaryKey = 'id';

    protected $fillable = [
        'email',
        'mat_khau',
        'ho_ten',
        'so_dien_thoai',
        'vai_tro',
        'anh_dai_dien',
        'trang_thai'
    ];

    public $timestamps = false;
}