<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrescriptionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'prescription_id',
        'medicamento',
        'dosis',
        'frecuencia',
        'duracion',
        'indicaciones',
    ];

    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }
}
