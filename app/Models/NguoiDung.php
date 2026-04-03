<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NguoiDung extends Model
{
    use HasFactory;

    // Tên bảng trong database
    protected $table = 'nguoi_dung';

    // Không dùng created_at / updated_at
    public $timestamps = false;

    // Các cột cho phép insert/update
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

    // Các cột không trả về API
    protected $hidden = [
        'mat_khau'
    ];
}