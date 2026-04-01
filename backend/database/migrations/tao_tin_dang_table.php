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

            // khóa ngoại
            $table->foreignId('nguoi_dung_id')->constrained('nguoi_dung');

            $table->foreignId('loai_phong_id')->constrained('loai_phong');

            $table->foreignId('vi_tri_id')->constrained('vi_tri');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tin_dang');
    }
};