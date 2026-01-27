<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctor_horarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->constrained('doctors')->cascadeOnDelete();
            $table->integer('day_of_week'); // 0=Domingo, 1=Lunes, ..., 6=Sábado
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('duration_minutes')->default(30); // Duración de cada cita
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->unique(['doctor_id', 'day_of_week']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctor_horarios');
    }
};
