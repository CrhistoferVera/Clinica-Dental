<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Especialidad extends Model
{
    use HasFactory;

    protected $table = 'especialidades';

    protected $fillable = [
        'nombre',
        'descripcion',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    /**
     * Doctores que tienen esta especialidad
     */
    public function doctors()
    {
        return $this->belongsToMany(Doctor::class, 'doctor_especialidad')
                    ->withTimestamps();
    }

    /**
     * Scope para especialidades activas
     */
    public function scopeActivas($query)
    {
        return $query->where('activo', true);
    }
}
