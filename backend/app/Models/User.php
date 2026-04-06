<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    //Chỉ định tên bảng tiếng Việt
    protected $table = 'nguoi_dung';

    public $timestamps = false;

    //Khai báo các cột được phép thêm dữ liệu
    protected $fillable = [
        'ho_ten',
        'email',
        'mat_khau',
        'so_dien_thoai',
        'vai_tro',
        'trang_thai',
        'anh_dai_dien',
        'ngay_tao',
    ];

    //Ẩn cột mật khẩu khi trả dữ liệu về cho Frontend (Bảo mật)
    protected $hidden = [
        'mat_khau',
    ];

    //Báo cho Laravel biết cột mật khẩu của ta tên là 'mat_khau'
    public function getAuthPassword()
    {
        return $this->mat_khau;
    }
}
