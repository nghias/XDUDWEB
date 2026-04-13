<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaoTinDangRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'tieu_de' => 'required|string|max:255',

            'mo_ta' => 'required|string',

            'gia_thue' => 'required|numeric|min:0',

            'dien_tich' => 'required|numeric|min:1',

            'ma_chu_nha' => 'required|exists:nguoi_dung,id',

            'ma_loai_phong' => 'required|exists:loai_phong,id',

        ];
    }
}