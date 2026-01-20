<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BusinessHoursSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar tabla primero
        DB::table('business_hours')->truncate();

        // Horarios de atención (Lunes a Viernes)
        $horariosSemana = [
            [
                'day_of_week' => 1, // Lunes
                'start_time' => '08:00:00',
                'end_time' => '18:00:00',
                'duration_minutes' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'day_of_week' => 2, // Martes
                'start_time' => '08:00:00',
                'end_time' => '18:00:00',
                'duration_minutes' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'day_of_week' => 3, // Miércoles
                'start_time' => '08:00:00',
                'end_time' => '18:00:00',
                'duration_minutes' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'day_of_week' => 4, // Jueves
                'start_time' => '08:00:00',
                'end_time' => '18:00:00',
                'duration_minutes' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'day_of_week' => 5, // Viernes
                'start_time' => '08:00:00',
                'end_time' => '18:00:00',
                'duration_minutes' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'day_of_week' => 6, // Sábado (horario reducido)
                'start_time' => '09:00:00',
                'end_time' => '13:00:00',
                'duration_minutes' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'day_of_week' => 0, // Domingo (cerrado - 0 minutos de duración)
                'start_time' => '00:00:00',
                'end_time' => '00:00:00',
                'duration_minutes' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('business_hours')->insert($horariosSemana);

        $this->command->info('✅ Horarios de atención creados exitosamente');
    }
}
