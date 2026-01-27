<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nombre',
        'apellido',
        'ci',
        'telefono',
        'email',
        'fecha_nacimiento',
        'matricula_profesional',
        'observaciones',
        'activo',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
        'activo' => 'boolean',
    ];

    /**
     * Usuario asociado al doctor (para login)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Usuario que creó el registro
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Usuario que actualizó el registro
     */
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Especialidades del doctor
     */
    public function especialidades()
    {
        return $this->belongsToMany(Especialidad::class, 'doctor_especialidad')
                    ->withTimestamps();
    }

    /**
     * Horarios del doctor
     */
    public function horarios()
    {
        return $this->hasMany(DoctorHorario::class)->orderBy('day_of_week');
    }

    /**
     * Citas del doctor
     */
    public function citas()
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * Nombre completo del doctor
     */
    public function getNombreCompletoAttribute(): string
    {
        return "{$this->nombre} {$this->apellido}";
    }

    /**
     * Scope para búsqueda rápida
     */
    public function scopeBuscar($query, string $termino)
    {
        return $query->where(function ($q) use ($termino) {
            $q->where('nombre', 'like', "%{$termino}%")
              ->orWhere('apellido', 'like', "%{$termino}%")
              ->orWhere('ci', 'like', "%{$termino}%")
              ->orWhere('telefono', 'like', "%{$termino}%")
              ->orWhere('matricula_profesional', 'like', "%{$termino}%");
        });
    }

    /**
     * Scope para doctores activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }
}
