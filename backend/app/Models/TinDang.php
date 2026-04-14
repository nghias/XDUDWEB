<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TinDang extends Model {
    protected $table = 'tin_dang';
    protected $guarded = [];
    public $timestamps = false;

    public function viTri() {
        return $this->hasOne(ViTri::class, 'ma_tin_dang', 'id');
    }
    public function loaiPhong() {
        return $this->belongsTo(LoaiPhong::class, 'ma_loai_phong', 'id');
    }
    public function hinhAnh() {
        return $this->hasMany(HinhAnhTin::class, 'ma_tin_dang', 'id');
    }
    public function tienIch() {
        return $this->belongsToMany(TienIch::class, 'tien_ich_tin_dang', 'ma_tin_dang', 'ma_tien_ich');
    }
    
    public function nguoiDung() {
        return $this->belongsTo(NguoiDung::class, 'ma_chu_nha', 'id');
    }
}