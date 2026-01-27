<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\ClinicalRecord;
use App\Models\Prescription;
use App\Models\PrescriptionItem;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;

class DoctorPanelController extends Controller
{
    /**
     * Obtener el doctor asociado al usuario actual
     */
    private function getDoctorFromUser()
    {
        $user = auth()->user();
        return Doctor::where('user_id', $user->id)->first();
    }

    /**
     * Panel principal del doctor - Vista con citas del día
     */
    public function index()
    {
        $doctor = $this->getDoctorFromUser();

        if (!$doctor) {
            return redirect()->route('dashboard')->with('error', 'No tienes perfil de doctor asignado.');
        }

        return Inertia::render('Doctor/PanelDoctor', [
            'doctor' => $doctor,
        ]);
    }

    /**
     * API: Obtener citas del día del doctor
     */
    public function citasHoy()
    {
        $doctor = $this->getDoctorFromUser();

        if (!$doctor) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $hoy = Carbon::today()->toDateString();

        $citas = Appointment::where('doctor_id', $doctor->id)
            ->where('date', $hoy)
            ->orderBy('time_start')
            ->get();

        return response()->json($citas);
    }

    /**
     * API: Obtener citas por fecha específica
     */
    public function citasPorFecha(Request $request)
    {
        $doctor = $this->getDoctorFromUser();

        if (!$doctor) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $fecha = $request->query('fecha', Carbon::today()->toDateString());

        $citas = Appointment::where('doctor_id', $doctor->id)
            ->where('date', $fecha)
            ->orderBy('time_start')
            ->get();

        return response()->json($citas);
    }

    /**
     * Vista: Atender paciente (desde una cita)
     */
    public function atenderCita($appointmentId)
    {
        $doctor = $this->getDoctorFromUser();

        if (!$doctor) {
            return redirect()->route('dashboard')->with('error', 'No autorizado');
        }

        $cita = Appointment::findOrFail($appointmentId);

        // Verificar que la cita pertenece a este doctor
        if ($cita->doctor_id !== $doctor->id) {
            return redirect()->route('panel-doctor')->with('error', 'Esta cita no te pertenece');
        }

        // Obtener paciente
        $patient = Patient::where('ci', $cita->patient_dni)->first();

        // Historial del paciente (todas las atenciones previas)
        $historial = [];
        if ($patient) {
            $historial = ClinicalRecord::with('doctor')
                ->where('patient_id', $patient->id)
                ->orderBy('fecha', 'desc')
                ->limit(10)
                ->get();
        }

        return Inertia::render('Doctor/AtenderPaciente', [
            'cita' => $cita,
            'patient' => $patient,
            'historial' => $historial,
            'doctor' => $doctor,
        ]);
    }

    /**
     * API: Guardar registro clínico (atención)
     */
    public function guardarAtencion(Request $request)
    {
        $doctor = $this->getDoctorFromUser();

        if (!$doctor) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'appointment_id' => 'nullable|exists:appointments,id',
            'patient_id' => 'required|exists:patients,id',
            'motivo_consulta' => 'required|string|max:255',
            'sintomas' => 'nullable|string',
            'diagnostico' => 'required|string',
            'tratamiento' => 'required|string',
            'observaciones' => 'nullable|string',
            'proxima_cita_sugerida' => 'nullable|string|max:100',
            'generar_receta' => 'boolean',
            'medicamentos' => 'nullable|array',
            'medicamentos.*.medicamento' => 'required_with:medicamentos|string',
            'medicamentos.*.dosis' => 'nullable|string',
            'medicamentos.*.frecuencia' => 'nullable|string',
            'medicamentos.*.duracion' => 'nullable|string',
            'medicamentos.*.indicaciones' => 'nullable|string',
        ]);

        // Crear registro clínico
        $clinicalRecord = ClinicalRecord::create([
            'appointment_id' => $validated['appointment_id'] ?? null,
            'patient_id' => $validated['patient_id'],
            'doctor_id' => $doctor->id,
            'fecha' => Carbon::today(),
            'motivo_consulta' => $validated['motivo_consulta'],
            'sintomas' => $validated['sintomas'] ?? null,
            'diagnostico' => $validated['diagnostico'],
            'tratamiento' => $validated['tratamiento'],
            'observaciones' => $validated['observaciones'] ?? null,
            'proxima_cita_sugerida' => $validated['proxima_cita_sugerida'] ?? null,
        ]);

        // Si hay cita asociada, marcarla como atendida
        if (!empty($validated['appointment_id'])) {
            $appointment = Appointment::find($validated['appointment_id']);
            if ($appointment) {
                $appointment->update(['status' => 'atendida']);
            }
        }

        // Si se debe generar receta
        if (!empty($validated['generar_receta']) && !empty($validated['medicamentos'])) {
            $prescription = Prescription::create([
                'clinical_record_id' => $clinicalRecord->id,
                'patient_id' => $validated['patient_id'],
                'doctor_id' => $doctor->id,
                'fecha' => Carbon::today(),
                'diagnostico' => $validated['diagnostico'],
                'notas' => null,
            ]);

            foreach ($validated['medicamentos'] as $med) {
                PrescriptionItem::create([
                    'prescription_id' => $prescription->id,
                    'medicamento' => $med['medicamento'],
                    'dosis' => $med['dosis'] ?? null,
                    'frecuencia' => $med['frecuencia'] ?? null,
                    'duracion' => $med['duracion'] ?? null,
                    'indicaciones' => $med['indicaciones'] ?? null,
                ]);
            }
        }

        return response()->json([
            'message' => 'Atención registrada exitosamente',
            'clinical_record' => $clinicalRecord,
        ]);
    }

    /**
     * API: Marcar cita como no asistió
     */
    public function marcarNoAsistio($appointmentId)
    {
        $doctor = $this->getDoctorFromUser();

        if (!$doctor) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $cita = Appointment::findOrFail($appointmentId);

        if ($cita->doctor_id !== $doctor->id) {
            return response()->json(['error' => 'Esta cita no te pertenece'], 403);
        }

        $cita->update(['status' => 'no_asistio']);

        return response()->json([
            'message' => 'Cita marcada como no asistió',
            'appointment' => $cita,
        ]);
    }

    /**
     * API: Obtener historial de un paciente
     */
    public function historialPaciente($patientId)
    {
        $doctor = $this->getDoctorFromUser();

        if (!$doctor) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $historial = ClinicalRecord::with(['doctor', 'prescription.items'])
            ->where('patient_id', $patientId)
            ->orderBy('fecha', 'desc')
            ->get();

        return response()->json($historial);
    }

    /**
     * API: Buscar pacientes
     */
    public function buscarPacientes(Request $request)
    {
        $termino = $request->query('q', '');

        if (strlen($termino) < 2) {
            return response()->json([]);
        }

        $pacientes = Patient::where('nombre', 'like', "%{$termino}%")
            ->orWhere('apellido', 'like', "%{$termino}%")
            ->orWhere('ci', 'like', "%{$termino}%")
            ->limit(10)
            ->get();

        return response()->json($pacientes);
    }

    /**
     * API: Crear receta sin cita (receta rápida)
     */
    public function crearRecetaRapida(Request $request)
    {
        $doctor = $this->getDoctorFromUser();

        if (!$doctor) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'diagnostico' => 'required|string',
            'notas' => 'nullable|string',
            'medicamentos' => 'required|array|min:1',
            'medicamentos.*.medicamento' => 'required|string',
            'medicamentos.*.dosis' => 'nullable|string',
            'medicamentos.*.frecuencia' => 'nullable|string',
            'medicamentos.*.duracion' => 'nullable|string',
            'medicamentos.*.indicaciones' => 'nullable|string',
        ]);

        $prescription = Prescription::create([
            'clinical_record_id' => null,
            'patient_id' => $validated['patient_id'],
            'doctor_id' => $doctor->id,
            'fecha' => Carbon::today(),
            'diagnostico' => $validated['diagnostico'],
            'notas' => $validated['notas'] ?? null,
        ]);

        foreach ($validated['medicamentos'] as $med) {
            PrescriptionItem::create([
                'prescription_id' => $prescription->id,
                'medicamento' => $med['medicamento'],
                'dosis' => $med['dosis'] ?? null,
                'frecuencia' => $med['frecuencia'] ?? null,
                'duracion' => $med['duracion'] ?? null,
                'indicaciones' => $med['indicaciones'] ?? null,
            ]);
        }

        return response()->json([
            'message' => 'Receta creada exitosamente',
            'prescription' => $prescription->load('items'),
        ]);
    }
}
