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

            'gia' => 'required|integer|min:0',

            'dien_tich' => 'required|integer|min:1',

            'nguoi_dung_id' => 'required|exists:nguoi_dung,id',

            'loai_phong_id' => 'required|exists:loai_phong,id',

            'vi_tri_id' => 'required|exists:vi_tri,id'

        ];
    }
}