<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "============================================\n";
echo "HORARIOS DE ATENCIÓN\n";
echo "============================================\n\n";

$horarios = \App\Models\BusinessHour::orderBy('day_of_week')->get();

$dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

foreach ($horarios as $horario) {
    $dia = $dias[$horario->day_of_week];
    echo "{$dia}: ";

    if ($horario->duration_minutes == 0) {
        echo "CERRADO\n";
    } else {
        echo "{$horario->start_time} - {$horario->end_time} ";
        echo "(citas de {$horario->duration_minutes} minutos)\n";
    }
}

echo "\n============================================\n";
echo "DÍAS EXCEPCIONALES\n";
echo "============================================\n\n";

$excepciones = \App\Models\DayException::orderBy('date')->get();

if ($excepciones->count() > 0) {
    foreach ($excepciones as $excepcion) {
        echo "{$excepcion->date}: ";

        if ($excepcion->is_closed) {
            echo "CERRADO\n";
        } else {
            echo "{$excepcion->start_time} - {$excepcion->end_time} ";
            echo "(citas de {$excepcion->duration_minutes} minutos)\n";
        }
    }
} else {
    echo "No hay días excepcionales configurados\n";
}

echo "\n============================================\n";
echo "Total horarios: " . $horarios->count() . "\n";
echo "Total excepciones: " . $excepciones->count() . "\n";
echo "============================================\n";
