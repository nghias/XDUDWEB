<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tin_nhan', function (Blueprint $table) {

            $table->id();

            // người gửi
            $table->foreignId('nguoi_gui_id')
                  ->constrained('nguoi_dung');

            // người nhận
            $table->foreignId('nguoi_nhan_id')
                  ->constrained('nguoi_dung');

            // bài đăng liên quan
            $table->foreignId('tin_dang_id')
                  ->constrained('tin_dang');

            $table->text('noi_dung');

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tin_nhan');
    }
};