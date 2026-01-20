<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AvailableHoursController;
use App\Http\Controllers\AvailableDaysController;
use App\Http\Controllers\AppointmentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Página de gestión de citas (solo para usuarios autenticados)
    Route::get('/gestion-citas', function () {
        return Inertia::render('GestionCitas');
    })->name('gestion-citas');
});

Route::get('/available-hours', [AvailableHoursController::class, 'index']);
Route::get('/available-days', [AvailableDaysController::class, 'index']);

// Rutas de citas (appointments)
Route::prefix('appointments')->group(function () {
    Route::get('/', [AppointmentController::class, 'index']); // Listar todas
    Route::post('/', [AppointmentController::class, 'store']); // Crear nueva
    Route::get('/calendar', [AppointmentController::class, 'calendar']); // Vista calendario
    Route::get('/{id}', [AppointmentController::class, 'show']); // Ver una específica
    Route::put('/{id}', [AppointmentController::class, 'update']); // Actualizar/Reprogramar
    Route::delete('/{id}', [AppointmentController::class, 'destroy']); // Eliminar
    Route::patch('/{id}/cancel', [AppointmentController::class, 'cancel']); // Cancelar
    Route::patch('/{id}/confirm', [AppointmentController::class, 'confirm']); // Confirmar
    Route::patch('/{id}/attended', [AppointmentController::class, 'markAsAttended']); // Marcar atendida
    Route::patch('/{id}/no-show', [AppointmentController::class, 'markAsNoShow']); // Marcar no asistió
});

require __DIR__.'/auth.php';
