<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    /**
     * Obtener todas las citas (con filtros opcionales)
     */
    public function index(Request $request)
    {
        $query = Appointment::query();

        // Filtros opcionales
        if ($request->has('status')) {
            $query->byStatus($request->status);
        }

        if ($request->has('date')) {
            $query->byDate($request->date);
        }

        if ($request->has('future')) {
            $query->futureAppointments();
        }

        $appointments = $query->orderBy('date', 'desc')
                             ->orderBy('time_start', 'desc')
                             ->get();

        return response()->json($appointments);
    }

    /**
     * Crear nueva cita
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_name' => 'required|string|max:255',
            'patient_lastname' => 'required|string|max:255',
            'patient_dni' => 'required|string|max:255',
            'patient_phone' => 'required|string|max:255',
            'patient_email' => 'required|email|max:255',
            'payment_method' => 'required|string',
            'date' => 'required|date|after_or_equal:today',
            'time_start' => 'required',
            'time_end' => 'required',
            'notes' => 'nullable|string',
        ]);

        // Verificar si el horario está disponible
        $existingAppointment = Appointment::where('date', $validated['date'])
            ->where('time_start', $validated['time_start'])
            ->whereNotIn('status', ['cancelada'])
            ->first();

        if ($existingAppointment) {
            return response()->json([
                'message' => 'Este horario ya está ocupado'
            ], 422);
        }

        // Si el usuario está autenticado, agregar su ID
        if (auth()->check()) {
            $validated['user_id'] = auth()->id();
        }

        $appointment = Appointment::create($validated);

        return response()->json([
            'message' => 'Cita creada exitosamente',
            'appointment' => $appointment
        ], 201);
    }

    /**
     * Obtener una cita específica
     */
    public function show($id)
    {
        $appointment = Appointment::findOrFail($id);
        return response()->json($appointment);
    }

    /**
     * Actualizar una cita (reprogramar, cambiar estado, etc)
     */
    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);

        $validated = $request->validate([
            'patient_name' => 'sometimes|string|max:255',
            'patient_lastname' => 'sometimes|string|max:255',
            'patient_dni' => 'sometimes|string|max:255',
            'patient_phone' => 'sometimes|string|max:255',
            'patient_email' => 'sometimes|email|max:255',
            'payment_method' => 'sometimes|string',
            'date' => 'sometimes|date',
            'time_start' => 'sometimes',
            'time_end' => 'sometimes',
            'status' => 'sometimes|in:programada,confirmada,atendida,no_asistio,cancelada',
            'notes' => 'nullable|string',
        ]);

        // Si se está reprogramando, verificar disponibilidad
        if (isset($validated['date']) || isset($validated['time_start'])) {
            $date = $validated['date'] ?? $appointment->date;
            $time = $validated['time_start'] ?? $appointment->time_start;

            $existingAppointment = Appointment::where('date', $date)
                ->where('time_start', $time)
                ->where('id', '!=', $id)
                ->whereNotIn('status', ['cancelada'])
                ->first();

            if ($existingAppointment) {
                return response()->json([
                    'message' => 'Este horario ya está ocupado'
                ], 422);
            }
        }

        $appointment->update($validated);

        return response()->json([
            'message' => 'Cita actualizada exitosamente',
            'appointment' => $appointment
        ]);
    }

    /**
     * Cancelar una cita
     */
    public function cancel($id)
    {
        $appointment = Appointment::findOrFail($id);

        $appointment->update(['status' => 'cancelada']);

        return response()->json([
            'message' => 'Cita cancelada exitosamente',
            'appointment' => $appointment
        ]);
    }

    /**
     * Confirmar una cita
     */
    public function confirm($id)
    {
        $appointment = Appointment::findOrFail($id);

        $appointment->update(['status' => 'confirmada']);

        return response()->json([
            'message' => 'Cita confirmada exitosamente',
            'appointment' => $appointment
        ]);
    }

    /**
     * Marcar como atendida
     */
    public function markAsAttended($id)
    {
        $appointment = Appointment::findOrFail($id);

        $appointment->update(['status' => 'atendida']);

        return response()->json([
            'message' => 'Cita marcada como atendida',
            'appointment' => $appointment
        ]);
    }

    /**
     * Marcar como no asistió
     */
    public function markAsNoShow($id)
    {
        $appointment = Appointment::findOrFail($id);

        $appointment->update(['status' => 'no_asistio']);

        return response()->json([
            'message' => 'Cita marcada como no asistió',
            'appointment' => $appointment
        ]);
    }

    /**
     * Obtener citas del calendario (por mes)
     */
    public function calendar(Request $request)
    {
        $month = $request->query('month', now()->month);
        $year = $request->query('year', now()->year);

        $appointments = Appointment::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->whereNotIn('status', ['cancelada'])
            ->orderBy('date')
            ->orderBy('time_start')
            ->get();

        return response()->json($appointments);
    }

    /**
     * Eliminar una cita (soft delete)
     */
    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();

        return response()->json([
            'message' => 'Cita eliminada exitosamente'
        ]);
    }
}
