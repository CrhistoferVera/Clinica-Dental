<?php

namespace Database\Seeders;

use App\Models\Especialidad;
use Illuminate\Database\Seeder;

class EspecialidadesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $especialidades = [
            [
                'nombre' => 'Odontologia General',
                'descripcion' => 'Atención dental integral y preventiva',
            ],
            [
                'nombre' => 'Ortodoncia',
                'descripcion' => 'Corrección de la posición de los dientes y maxilares',
            ],
            [
                'nombre' => 'Endodoncia',
                'descripcion' => 'Tratamiento de conductos radiculares',
            ],
            [
                'nombre' => 'Odontopediatria',
                'descripcion' => 'Atención dental especializada para niños',
            ],
            [
                'nombre' => 'Cirugia Bucal/Maxilofacial',
                'descripcion' => 'Procedimientos quirúrgicos de boca, cara y mandíbula',
            ],
        ];

        foreach ($especialidades as $especialidad) {
            Especialidad::firstOrCreate(
                ['nombre' => $especialidad['nombre']],
                $especialidad
            );
        }
    }
}
