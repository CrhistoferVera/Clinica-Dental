<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seeders de la clínica dental (roles primero)
        $this->call([
            RolesSeeder::class,
            BusinessHoursSeeder::class,
            DayExceptionsSeeder::class,
        ]);

        // Crear usuario de prueba con rol admin
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        $user->assignRole('admin');
    }
}
