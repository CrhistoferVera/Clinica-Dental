<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AvailableHoursController;
use App\Http\Controllers\AvailableDaysController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PatientController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing page pública
Route::get('/', function () {
    return Inertia::render('Landing');
})->name('home');

// Portal del paciente (protegido)
Route::get('/portal-paciente', function () {
    return Inertia::render('PortalPaciente');
})->middleware(['auth', 'role:paciente'])->name('portal-paciente');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', 'role:admin|recepcion|doctor'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/gestion-citas', function () {
    return Inertia::render('GestionCitas');
})->middleware(['auth', 'verified', 'role:admin|recepcion|doctor'])->name('gestion-citas');

Route::get('/available-hours', [AvailableHoursController::class, 'index']);
Route::get('/available-days', [AvailableDaysController::class, 'index']);

// Rutas publicas de appointments
Route::post('/appointments', [AppointmentController::class, 'store']);

// Rutas de pacientes (solo rol paciente)
Route::middleware(['auth', 'role:paciente'])->prefix('mis-citas')->group(function () {
    Route::get('/', [AppointmentController::class, 'misCitas']);
    Route::get('/pendientes', [AppointmentController::class, 'misCitasPendientes']);
    Route::patch('/{id}/confirmar', [AppointmentController::class, 'confirmarMiCita']);
    Route::patch('/{id}/cancelar', [AppointmentController::class, 'cancelarMiCita']);
});

// Rutas protegidas de appointments (requieren auth + rol)
Route::middleware(['auth', 'role:admin|recepcion|doctor'])->prefix('appointments')->group(function () {
    Route::get('/', [AppointmentController::class, 'index']);
    Route::get('/calendar', [AppointmentController::class, 'calendar']);
    Route::get('/{id}', [AppointmentController::class, 'show']);
    Route::put('/{id}', [AppointmentController::class, 'update']);
    Route::patch('/{id}/cancel', [AppointmentController::class, 'cancel']);
    Route::patch('/{id}/confirm', [AppointmentController::class, 'confirm']);
    Route::patch('/{id}/attended', [AppointmentController::class, 'markAsAttended']);
    Route::patch('/{id}/no-show', [AppointmentController::class, 'markAsNoShow']);
});

// Eliminar cita - solo admin
Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy'])
    ->middleware(['auth', 'role:admin']);

// Rutas protegidas de pacientes (requieren auth + rol)
Route::middleware(['auth', 'role:admin|recepcion|doctor'])->prefix('patients')->group(function () {
    Route::get('/', [PatientController::class, 'index']);
    Route::post('/', [PatientController::class, 'store']);
    Route::get('/{id}', [PatientController::class, 'show']);
    Route::put('/{id}', [PatientController::class, 'update']);
});

Route::middleware(['auth', 'role:admin|recepcion|doctor'])->group(function () {
    // Página de gestión de pacientes
    Route::get('/gestion-pacientes', function () {
        return \Inertia\Inertia::render('GestionPacientes');
    })->name('gestion-pacientes');

    Route::get('/historia-clinica', function () {
        return \Inertia\Inertia::render('HistoriaClinica');
    })->name('historia-clinica');

    Route::get('/recetas', function () {
        return \Inertia\Inertia::render('Recetas');
    })->name('recetas');
});

// Eliminar paciente - solo admin
Route::delete('/patients/{id}', [PatientController::class, 'destroy'])
    ->middleware(['auth', 'role:admin']);

require __DIR__.'/auth.php';

