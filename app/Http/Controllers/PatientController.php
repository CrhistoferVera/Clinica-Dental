<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    /**
     * Listar pacientes con búsqueda opcional
     */
    public function index(Request $request)
    {
        $query = Patient::query();

        if ($request->has('buscar') && $request->buscar !== '') {
            $query->buscar($request->buscar);
        }

        $patients = $query->orderBy('apellido')
                          ->orderBy('nombre')
                          ->paginate(20);

        return response()->json($patients);
    }

    /**
     * Crear nuevo paciente
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'ci' => 'required|string|max:20|unique:patients,ci',
            'telefono' => 'required|string|max:20',
            'email' => 'nullable|email|max:100',
            'fecha_nacimiento' => 'nullable|date',
            'alergias' => 'nullable|string',
            'antecedentes' => 'nullable|string',
            'observaciones' => 'nullable|string',
        ]);

        $validated['created_by'] = auth()->id();

        $patient = Patient::create($validated);

        return response()->json([
            'message' => 'Paciente creado exitosamente',
            'patient' => $patient
        ], 201);
    }

    /**
     * Mostrar un paciente específico
     */
    public function show($id)
    {
        $patient = Patient::with(['createdBy', 'updatedBy'])->findOrFail($id);
        return response()->json($patient);
    }

    /**
     * Actualizar paciente
     */
    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'apellido' => 'sometimes|string|max:100',
            'ci' => 'sometimes|string|max:20|unique:patients,ci,' . $id,
            'telefono' => 'sometimes|string|max:20',
            'email' => 'nullable|email|max:100',
            'fecha_nacimiento' => 'nullable|date',
            'alergias' => 'nullable|string',
            'antecedentes' => 'nullable|string',
            'observaciones' => 'nullable|string',
        ]);

        $validated['updated_by'] = auth()->id();

        $patient->update($validated);

        return response()->json([
            'message' => 'Paciente actualizado exitosamente',
            'patient' => $patient
        ]);
    }

    /**
     * Eliminar paciente
     */
    public function destroy($id)
    {
        $patient = Patient::findOrFail($id);
        $patient->delete();

        return response()->json([
            'message' => 'Paciente eliminado exitosamente'
        ]);
    }
}
