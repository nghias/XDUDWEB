<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TinDang extends Model
{
    protected $table = 'tin_dang';

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
        return $this->belongsTo(NguoiDung::class,'nguoi_dung_id');
    }

    public function loaiPhong()
    {
        return $this->belongsTo(LoaiPhong::class,'loai_phong_id');
    }

    public function viTri()
    {
        return $this->belongsTo(ViTri::class,'vi_tri_id');
    }

    public function hinhAnh()
    {
        return $this->hasMany(HinhAnhTin::class,'ma_tin_dang');
    }
}