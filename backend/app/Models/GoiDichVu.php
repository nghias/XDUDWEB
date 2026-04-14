<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GoiDichVu extends Model
{
   
    protected $table = 'goi_dich_vu'; 
    
   
    public $timestamps = false; 

    // thêm/sửa dữ liệu
    protected $fillable = [
        'ten_goi',
        'gia_tien',
        'thoi_han_ngay',
        'muc_uu_tien'
    ];
}
