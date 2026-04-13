<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoaiPhong extends Model
{
    protected $table = 'loai_phong';
    public $timestamps = false;

    public function tinDang()
    {
        return $this->hasMany(TinDang::class,'ma_loai_phong','id');
    }
}