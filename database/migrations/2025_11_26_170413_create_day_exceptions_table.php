<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('day_exceptions', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique();
            $table->boolean('is_closed')->default(false); // true si está cerrado ese día
            $table->time('start_time')->nullable(); // Si tiene horario especial
            $table->time('end_time')->nullable();
            $table->integer('duration_minutes')->default(30);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('day_exceptions');
    }
};
