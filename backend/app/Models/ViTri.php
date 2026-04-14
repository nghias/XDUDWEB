<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ViTri extends Model {
    protected $table = 'vi_tri';
    protected $fillable = ['ma_tin_dang', 'tinh_thanh_pho', 'quan_huyen', 'phuong_xa', 'ten_duong', 'dia_chi_chi_tiet', 'vi_do', 'kinh_do'];
    public $timestamps = false;
}