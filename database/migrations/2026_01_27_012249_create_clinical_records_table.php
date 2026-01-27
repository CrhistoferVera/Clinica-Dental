<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clinical_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')->nullable()->constrained('appointments')->nullOnDelete();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('doctor_id')->constrained('doctors')->cascadeOnDelete();
            $table->date('fecha');
            $table->string('motivo_consulta');
            $table->text('sintomas')->nullable();
            $table->text('diagnostico');
            $table->text('tratamiento');
            $table->text('observaciones')->nullable();
            $table->string('proxima_cita_sugerida')->nullable();
            $table->timestamps();

            $table->index('patient_id');
            $table->index('doctor_id');
            $table->index('fecha');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clinical_records');
    }
};
