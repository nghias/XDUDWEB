<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TinNhan extends Model
{
    protected $table = 'tin_nhan';

    public $timestamps = false;

    protected $fillable = [
        'ma_cuoc_tro_chuyen',
        'ma_nguoi_gui',
        'noi_dung',
        'da_doc',
        'ngay_gui'
    ];
}