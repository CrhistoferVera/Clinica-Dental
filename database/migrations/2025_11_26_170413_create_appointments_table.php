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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('patient_name');
            $table->string('patient_lastname');
            $table->string('patient_dni');
            $table->string('patient_phone');
            $table->string('patient_email');
            $table->string('payment_method')->default('Efectivo');
            $table->date('date');
            $table->time('time_start');
            $table->time('time_end');
            $table->enum('status', ['programada', 'confirmada', 'atendida', 'no_asistio', 'cancelada'])->default('programada');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
