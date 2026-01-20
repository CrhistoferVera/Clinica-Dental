<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'patient_name',
        'patient_lastname',
        'patient_dni',
        'patient_phone',
        'patient_email',
        'payment_method',
        'date',
        'time_start',
        'time_end',
        'status',
        'notes'
    ];

    protected $casts = [
        'date' => 'date',
    ];

    // Relación con usuario (si está autenticado)
    public function user() {
        return $this->belongsTo(User::class);
    }

    // Scope para filtrar por estado
    public function scopeByStatus($query, $status) {
        return $query->where('status', $status);
    }

    // Scope para filtrar por fecha
    public function scopeByDate($query, $date) {
        return $query->whereDate('date', $date);
    }

    // Scope para citas futuras
    public function scopeFutureAppointments($query) {
        return $query->where('date', '>=', now()->toDateString())
                     ->orderBy('date')
                     ->orderBy('time_start');
    }
}
