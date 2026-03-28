<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    /**
     * Cho phép request này được sử dụng
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Các rule validate dữ liệu
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|integer|min:0',
            'area' => 'required|integer|min:0',
            'address' => 'required|string|max:255',
            'owner_id' => 'required|integer'
        ];
    }
}