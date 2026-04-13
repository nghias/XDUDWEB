<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class CuocTroChuyen extends Model
{
    protected $table = 'cuoc_tro_chuyen';
    public $timestamps = false;

    public function tinDang()
    {
        return $this->belongsTo(TinDang::class,'ma_tin_dang','id');
    }

    public function chuNha()
    {
        return $this->belongsTo(NguoiDung::class,'ma_chu_nha','id');
    }

    public function nguoiTimPhong()
    {
        return $this->belongsTo(NguoiDung::class,'ma_nguoi_tim_phong','id');
    }
}