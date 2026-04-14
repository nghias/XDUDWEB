<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DatPhong extends Model
{
    protected $table = 'dat_phong';

    public $timestamps = false;

    protected $fillable = [
        'ma_tin_dang',
        'ma_nguoi_dat',
        'ngay_dat',
        'trang_thai',
        'ghi_chu'
    ];

    public function tinDang()
    {
        return $this->belongsTo(TinDang::class,'ma_tin_dang','id');
    }

    public function nguoiDung()
    {
        return $this->belongsTo(NguoiDung::class,'ma_nguoi_dat','id');
    }
}