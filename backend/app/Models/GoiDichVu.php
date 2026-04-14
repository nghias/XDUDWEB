<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GoiDichVu extends Model
{
    protected $table = 'goi_dich_vu'; 
    
    public $timestamps = false; 

    // CHÚ Ý PHẦN NÀY: Phải khai báo đủ các cột thì Laravel mới cho phép lưu
    protected $fillable = [
        'ten_goi',
        'gia_tien',
        'thoi_han_ngay',
        'muc_uu_tien',
        'so_tin_toi_da', // Thêm dòng này để lưu được số tin
        'noi_bat',       // Thêm dòng này để lưu trạng thái Nổi bật
        'mo_ta'          // Thêm dòng này để lưu mô tả
    ];
}