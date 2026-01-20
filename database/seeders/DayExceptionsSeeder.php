<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DayExceptionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar tabla primero
        DB::table('day_exceptions')->truncate();

        // Ejemplos de días excepcionales (puedes agregar más)
        $excepciones = [
            // Año Nuevo
            [
                'date' => '2026-01-01',
                'is_closed' => true,
                'start_time' => null,
                'end_time' => null,
                'duration_minutes' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Día del Trabajo
            [
                'date' => '2026-05-01',
                'is_closed' => true,
                'start_time' => null,
                'end_time' => null,
                'duration_minutes' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Navidad
            [
                'date' => '2026-12-25',
                'is_closed' => true,
                'start_time' => null,
                'end_time' => null,
                'duration_minutes' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Ejemplo de día con horario especial (ej: 24 de diciembre - horario reducido)
            [
                'date' => '2026-12-24',
                'is_closed' => false,
                'start_time' => '08:00:00',
                'end_time' => '12:00:00',
                'duration_minutes' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('day_exceptions')->insert($excepciones);

        $this->command->info('✅ Días de excepción creados exitosamente');
    }
}
