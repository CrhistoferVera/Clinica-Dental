<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\DoctorHorario;
use App\Models\Especialidad;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DoctorController extends Controller
{
    /**
     * Listar doctores con búsqueda opcional
     */
    public function index(Request $request)
    {
        $query = Doctor::with(['especialidades', 'horarios']);

        if ($request->has('buscar') && $request->buscar !== '') {
            $query->buscar($request->buscar);
        }

        $doctors = $query->orderBy('apellido')
                         ->orderBy('nombre')
                         ->paginate(20);

        return response()->json($doctors);
    }

    /**
     * Listar doctores activos (para selección en citas)
     */
    public function activos()
    {
        $doctors = Doctor::with(['especialidades', 'horarios'])
                         ->activos()
                         ->orderBy('apellido')
                         ->orderBy('nombre')
                         ->get();

        return response()->json($doctors);
    }

    /**
     * Obtener todas las especialidades activas
     */
    public function especialidades()
    {
        $especialidades = Especialidad::activas()
                                      ->orderBy('nombre')
                                      ->get();

        return response()->json($especialidades);
    }

    /**
     * Crear nuevo doctor
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'ci' => 'required|string|max:20|unique:doctors,ci|unique:users,ci',
            'telefono' => 'required|string|max:20',
            'email' => 'required|email|max:100|unique:users,email',
            'fecha_nacimiento' => 'nullable|date',
            'matricula_profesional' => 'nullable|string|max:50',
            'observaciones' => 'nullable|string',
            'especialidades' => 'required|array|min:1',
            'especialidades.*' => 'exists:especialidades,id',
            'horarios' => 'required|array|min:1',
            'horarios.*.day_of_week' => 'required|integer|min:0|max:6',
            'horarios.*.start_time' => 'required|date_format:H:i',
            'horarios.*.end_time' => 'required|date_format:H:i|after:horarios.*.start_time',
            'horarios.*.duration_minutes' => 'nullable|integer|min:15|max:120',
        ]);

        // Generar contraseña aleatoria
        $password = Str::random(8);

        $result = DB::transaction(function () use ($validated, $password) {
            // Crear el usuario
            $user = User::create([
                'name' => $validated['nombre'],
                'apellido' => $validated['apellido'],
                'ci' => $validated['ci'],
                'telefono' => $validated['telefono'],
                'email' => $validated['email'],
                'password' => Hash::make($password),
            ]);

            // Asignar rol de doctor
            $user->assignRole('doctor');

            // Crear el doctor vinculado al usuario
            $doctorData = collect($validated)->except(['especialidades', 'horarios'])->toArray();
            $doctorData['user_id'] = $user->id;
            $doctorData['created_by'] = auth()->id();

            $doctor = Doctor::create($doctorData);

            // Asignar especialidades
            $doctor->especialidades()->attach($validated['especialidades']);

            // Crear horarios
            foreach ($validated['horarios'] as $horario) {
                $doctor->horarios()->create([
                    'day_of_week' => $horario['day_of_week'],
                    'start_time' => $horario['start_time'],
                    'end_time' => $horario['end_time'],
                    'duration_minutes' => $horario['duration_minutes'] ?? 30,
                    'activo' => true,
                ]);
            }

            return [
                'user' => $user,
                'doctor' => $doctor->load(['especialidades', 'horarios']),
            ];
        });

        return response()->json([
            'message' => 'Doctor creado exitosamente',
            'doctor' => $result['doctor'],
            'credentials' => [
                'email' => $validated['email'],
                'password' => $password,
            ]
        ], 201);
    }

    /**
     * Mostrar un doctor específico
     */
    public function show($id)
    {
        $doctor = Doctor::with(['especialidades', 'horarios', 'createdBy', 'updatedBy'])->findOrFail($id);
        return response()->json($doctor);
    }

    /**
     * Actualizar doctor
     */
    public function update(Request $request, $id)
    {
        $doctor = Doctor::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'apellido' => 'sometimes|string|max:100',
            'ci' => 'sometimes|string|max:20|unique:doctors,ci,' . $id,
            'telefono' => 'sometimes|string|max:20',
            'email' => 'nullable|email|max:100',
            'fecha_nacimiento' => 'nullable|date',
            'matricula_profesional' => 'nullable|string|max:50',
            'observaciones' => 'nullable|string',
            'activo' => 'sometimes|boolean',
            'especialidades' => 'sometimes|array|min:1',
            'especialidades.*' => 'exists:especialidades,id',
            'horarios' => 'sometimes|array',
            'horarios.*.day_of_week' => 'required|integer|min:0|max:6',
            'horarios.*.start_time' => 'required|date_format:H:i',
            'horarios.*.end_time' => 'required|date_format:H:i|after:horarios.*.start_time',
            'horarios.*.duration_minutes' => 'nullable|integer|min:15|max:120',
            'horarios.*.activo' => 'nullable|boolean',
        ]);

        DB::transaction(function () use ($doctor, $validated) {
            $doctorData = collect($validated)->except(['especialidades', 'horarios'])->toArray();
            $doctorData['updated_by'] = auth()->id();

            $doctor->update($doctorData);

            // Actualizar especialidades si se proporcionaron
            if (isset($validated['especialidades'])) {
                $doctor->especialidades()->sync($validated['especialidades']);
            }

            // Actualizar horarios si se proporcionaron
            if (isset($validated['horarios'])) {
                // Eliminar horarios existentes y crear nuevos
                $doctor->horarios()->delete();

                foreach ($validated['horarios'] as $horario) {
                    $doctor->horarios()->create([
                        'day_of_week' => $horario['day_of_week'],
                        'start_time' => $horario['start_time'],
                        'end_time' => $horario['end_time'],
                        'duration_minutes' => $horario['duration_minutes'] ?? 30,
                        'activo' => $horario['activo'] ?? true,
                    ]);
                }
            }
        });

        return response()->json([
            'message' => 'Doctor actualizado exitosamente',
            'doctor' => $doctor->load(['especialidades', 'horarios'])
        ]);
    }

    /**
     * Eliminar doctor
     */
    public function destroy($id)
    {
        $doctor = Doctor::findOrFail($id);
        $doctor->delete();

        return response()->json([
            'message' => 'Doctor eliminado exitosamente'
        ]);
    }
}
