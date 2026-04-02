<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HinhAnhTin extends Model
{
    protected $table = 'hinh_anh_tin';

    protected $fillable = [
        'ma_tin_dang',
        'duong_dan_anh',
        'la_anh_bia'
    ];

    public function tinDang()
    {
        return $this->belongsTo(TinDang::class,'ma_tin_dang');
    }
}