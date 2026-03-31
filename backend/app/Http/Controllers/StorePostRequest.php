<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
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

            'dien_tich' => 'required|integer|min:0',

            'nguoi_dang_id' => 'required|integer',

            'loai_phong_id' => 'required|integer',

            'vi_tri_id' => 'required|integer'

        ];
    }
}