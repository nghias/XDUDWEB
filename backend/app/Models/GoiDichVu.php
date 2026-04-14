<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GoiDichVu extends Model
{
    protected $table = 'goi_dich_vu'; 
    
    public $timestamps = false; 

    // Cho phép thêm/sửa các trường dữ liệu sau
    protected $fillable = [
        'ten_goi',
        'gia_tien',
        'thoi_han_ngay',
        'muc_uu_tien',
        // --- 3 trường mới thêm vào ---
        'so_tin_toi_da', 
        'noi_bat',       
        'mo_ta'          
    ];
}