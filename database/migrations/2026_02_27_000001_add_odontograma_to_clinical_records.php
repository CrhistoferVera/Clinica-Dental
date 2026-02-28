<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clinical_records', function (Blueprint $table) {
            $table->json('odontograma')->nullable()->after('observaciones');
            $table->json('plan_tratamiento')->nullable()->after('odontograma');
        });
    }

    public function down(): void
    {
        Schema::table('clinical_records', function (Blueprint $table) {
            $table->dropColumn(['odontograma', 'plan_tratamiento']);
        });
    }
};
