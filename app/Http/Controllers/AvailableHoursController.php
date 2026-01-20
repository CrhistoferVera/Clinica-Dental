<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BusinessHour;
use App\Models\DayException;
use App\Models\Appointment;
use Carbon\Carbon;

class AvailableHoursController extends Controller
{
   public function index(Request $request)
   {
       $date = $request->query('date');

       $dayOfWeek = Carbon::parse($date)->dayOfWeek;

       // Buscar excepción
       $exception = DayException::where('date', $date)->first();

       if ($exception?->is_closed) return response()->json([]);

       $hours = $exception ?? BusinessHour::where('day_of_week', $dayOfWeek)->first();

       if (!$hours || $hours->duration_minutes == 0) return response()->json([]);

       $start = Carbon::parse($hours->start_time);
       $end = Carbon::parse($hours->end_time);
       $slots = [];

       while ($start->lt($end)) {
           $slotEnd = $start->copy()->addMinutes($hours->duration_minutes);
           $slots[] = "{$start->format('H:i')} - {$slotEnd->format('H:i')}";
           $start->addMinutes($hours->duration_minutes);
       }

       // Quitar citas ocupadas
       $ocupadas = Appointment::where('date', $date)
                   ->pluck('time_start')
                   ->toArray();

       $disponibles = array_filter($slots, function($slot) use ($ocupadas) {
           $hora = explode(' - ', $slot)[0];
           return !in_array($hora, $ocupadas);
       });

       return response()->json(array_values($disponibles));
   }
}
