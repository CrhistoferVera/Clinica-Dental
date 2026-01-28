<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Models\Appointment;
use Carbon\Carbon;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/**
 * Comando para liberar citas no confirmadas
 * Las citas con estado 'programada' cuya fecha sea hoy se cancelan automáticamente
 */
Artisan::command('citas:liberar-no-confirmadas', function () {
    $hoy = Carbon::today()->toDateString();

    // Buscar citas programadas (no confirmadas) para hoy
    $citasNoConfirmadas = Appointment::where('status', 'programada')
        ->where('date', $hoy)
        ->get();

    $count = $citasNoConfirmadas->count();

    if ($count > 0) {
        // Actualizar todas las citas no confirmadas a 'cancelada'
        Appointment::where('status', 'programada')
            ->where('date', $hoy)
            ->update(['status' => 'cancelada']);

        $this->info("Se liberaron {$count} citas no confirmadas para hoy ({$hoy}).");
    } else {
        $this->info("No hay citas pendientes de confirmación para hoy ({$hoy}).");
    }
})->purpose('Liberar citas no confirmadas el día de la cita');

/**
 * Programar el comando para ejecutarse todos los días a las 6:00 AM
 */
Schedule::command('citas:liberar-no-confirmadas')->dailyAt('06:00');
