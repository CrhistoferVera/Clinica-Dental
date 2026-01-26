<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorHorario extends Model
{
    use HasFactory;

    protected $table = 'doctor_horarios';

    protected $fillable = [
        'doctor_id',
        'day_of_week',
        'start_time',
        'end_time',
        'duration_minutes',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'day_of_week' => 'integer',
        'duration_minutes' => 'integer',
    ];

    /**
     * Nombres de los días de la semana
     */
    public const DIAS_SEMANA = [
        0 => 'Domingo',
        1 => 'Lunes',
        2 => 'Martes',
        3 => 'Miércoles',
        4 => 'Jueves',
        5 => 'Viernes',
        6 => 'Sábado',
    ];

    /**
     * Doctor al que pertenece este horario
     */
    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    /**
     * Obtener nombre del día
     */
    public function getNombreDiaAttribute(): string
    {
        return self::DIAS_SEMANA[$this->day_of_week] ?? 'Desconocido';
    }

    /**
     * Scope para horarios activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }
}
