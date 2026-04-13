<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TinDang extends Model
{
    protected $table = 'tin_dang';
    public $timestamps = false;

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

    public function nguoiDung()
    {
        return $this->belongsTo(NguoiDung::class,'ma_chu_nha','id');
    }

    public function loaiPhong()
    {
        return $this->belongsTo(LoaiPhong::class,'ma_loai_phong','id');
    }

    public function hinhAnh()
    {
        return $this->hasMany(HinhAnhTin::class,'ma_tin_dang','id');
    }
    public function viTri()
    {
        return $this->hasOne(ViTri::class, 'ma_tin_dang', 'id');
    }
}