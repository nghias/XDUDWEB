<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    public $timestamps = false; // Tắt timestamp để đúng chuẩn bảng chỉ có id và name
    protected $fillable = ['name'];
}