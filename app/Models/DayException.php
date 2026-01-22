<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DayException extends Model
{
    use HasFactory;

    protected $fillable = ['date', 'is_closed', 'start_time', 'end_time', 'duration_minutes', 'notes'];
}
