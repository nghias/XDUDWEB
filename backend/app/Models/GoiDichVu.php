<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GoiDichVu extends Model
{
    protected $table = 'goi_dich_vu'; 
    
    public $timestamps = false; 

    protected $fillable = [
        'ten_goi',
        'gia_tien',
        'thoi_han_ngay',
        'muc_uu_tien',
        // Thêm 3 trường dưới đây vào (đảm bảo tên trùng với cột trong MySQL)
        'so_tin_toi_da', 
        'la_goi_noi_bat', 
        'mo_ta',
    ];
}