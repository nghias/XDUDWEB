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

            $table->unsignedBigInteger('nguoi_gui_id');
            $table->unsignedBigInteger('nguoi_nhan_id');

            $table->text('noi_dung');

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tin_nhan');
    }
};