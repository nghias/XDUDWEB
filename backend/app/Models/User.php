<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
be-user
    protected $table = "nguoi_dung";

    protected $fillable = [
        "ten",
        "email",
        "mat_khau",
        "so_dien_thoai"

    use HasFactory;

    // Chỉ định chính xác tên bảng
    protected $table = 'nguoi_dung';

    // Tắt timestamps mặc định của Laravel vì bạn dùng 'ngay_tao' thay vì 'created_at'/'updated_at'
    public $timestamps = false; 

    // Các trường được phép thêm/sửa (mass assignment)
    protected $fillable = [
        'email',
        'mat_khau',
        'ho_ten',
        'so_dien_thoai',
        'vai_tro',
        'anh_dai_dien',
        'trang_thai',
        'ngay_tao'
main
    ];
}