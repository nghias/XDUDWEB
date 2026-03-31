<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tin_dang', function (Blueprint $table) {
            $table->id();

            $table->string('tieu_de');
            $table->text('mo_ta');

            $table->integer('gia');
            $table->integer('dien_tich');

            $table->unsignedBigInteger('nguoi_dang_id');
            $table->unsignedBigInteger('loai_phong_id');
            $table->unsignedBigInteger('vi_tri_id');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tin_dang');
    }
};