<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->string('ci', 20)->unique();
            $table->string('telefono', 20);
            $table->string('email', 100)->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->text('alergias')->nullable();
            $table->text('antecedentes')->nullable();
            $table->text('observaciones')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['nombre', 'apellido']);
            $table->index('telefono');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
