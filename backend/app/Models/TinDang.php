<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class TinDang extends Model {
    protected $table = 'tin_dang';
    protected $guarded = []; // Cho phép mass assignment

    public function viTri() {
        return $this->hasOne(ViTri::class, 'ma_tin_dang', 'id');
    }
    public function loaiPhong() {
        return $this->belongsTo(LoaiPhong::class, 'ma_loai_phong', 'id');
    }
    public function hinhAnh() {
        return $this->hasMany(HinhAnhTin::class, 'ma_tin_dang', 'id');
    }
    // Quan hệ nhiều-nhiều với bảng Tiện Ích
    public function tienIch() {
        return $this->belongsToMany(TienIch::class, 'tien_ich_tin_dang', 'ma_tin_dang', 'ma_tien_ich');
    }
}