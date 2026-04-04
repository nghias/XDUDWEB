<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TinNhan extends Model
{
    protected $table = 'tin_nhan';

    protected $fillable = [
        'ma_cuoc_tro_chuyen',
        'ma_nguoi_gui',
        'noi_dung',
        'da_doc'
    ];

    public $timestamps = false;
}