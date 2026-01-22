# Instrucciones para Configurar Horarios

## ✅ Datos Ya Cargados

Los horarios de atención han sido cargados exitosamente en tu base de datos:

### Horarios de Atención Semanal

| Día | Horario | Duración de Citas |
|-----|---------|-------------------|
| Lunes | 08:00 - 18:00 | 30 minutos |
| Martes | 08:00 - 18:00 | 30 minutos |
| Miércoles | 08:00 - 18:00 | 30 minutos |
| Jueves | 08:00 - 18:00 | 30 minutos |
| Viernes | 08:00 - 18:00 | 30 minutos |
| Sábado | 09:00 - 13:00 | 30 minutos |
| Domingo | CERRADO | - |

### Días Excepcionales (Festivos)

- **2026-01-01**: Año Nuevo (CERRADO)
- **2026-05-01**: Día del Trabajo (CERRADO)
- **2026-12-24**: Nochebuena (08:00 - 12:00)
- **2026-12-25**: Navidad (CERRADO)

## 📋 Opciones para Agregar/Modificar Datos

### Opción 1: Usar los Seeders (Recomendado)

Los seeders ya están creados. Para ejecutarlos:

```bash
# Ejecutar todos los seeders
php artisan db:seed

# O ejecutar seeders específicos
php artisan db:seed --class=BusinessHoursSeeder
php artisan db:seed --class=DayExceptionsSeeder
```

**Archivos de seeders:**
- `database/seeders/BusinessHoursSeeder.php` - Horarios semanales
- `database/seeders/DayExceptionsSeeder.php` - Días festivos/especiales

### Opción 2: Ejecutar SQL Directo

Puedes usar el archivo SQL que creé:

```bash
# Conectarte a tu base de datos y ejecutar:
mysql -u usuario -p nombre_base_datos < database/sql/llenar_horarios.sql
```

O copiar y pegar las queries desde el archivo:
`database/sql/llenar_horarios.sql`

### Opción 3: Usar Tinker (Línea de Comandos)

```bash
php artisan tinker
```

Luego ejecutar:

```php
// Crear un horario
\App\Models\BusinessHour::create([
    'day_of_week' => 1, // 0=Domingo, 1=Lunes, etc.
    'start_time' => '08:00:00',
    'end_time' => '18:00:00',
    'duration_minutes' => 30
]);

// Crear un día excepcional (cerrado)
\App\Models\DayException::create([
    'date' => '2026-12-31',
    'is_closed' => true
]);

// Crear un día con horario especial
\App\Models\DayException::create([
    'date' => '2026-12-24',
    'is_closed' => false,
    'start_time' => '08:00:00',
    'end_time' => '12:00:00',
    'duration_minutes' => 30
]);
```

## 🔧 Modificar Horarios Existentes

### Cambiar duración de citas

Por ejemplo, si quieres citas de 45 minutos en lugar de 30:

```php
\App\Models\BusinessHour::where('day_of_week', 1)->update(['duration_minutes' => 45]);
```

### Cambiar horarios de un día específico

```php
\App\Models\BusinessHour::where('day_of_week', 6)->update([
    'start_time' => '10:00:00',
    'end_time' => '14:00:00'
]);
```

## 📅 Agregar Más Días Festivos

Edita el archivo `database/seeders/DayExceptionsSeeder.php` y agrega más fechas según tu país:

```php
[
    'date' => '2026-07-09', // Ejemplo: Día de la Independencia
    'is_closed' => true,
    'start_time' => null,
    'end_time' => null,
    'duration_minutes' => 0,
    'created_at' => now(),
    'updated_at' => now(),
],
```

Luego ejecuta:
```bash
php artisan db:seed --class=DayExceptionsSeeder
```

## 🔍 Verificar Datos Cargados

Ejecuta el script de verificación que creé:

```bash
php verificar_horarios.php
```

O consulta directamente en la base de datos:

```sql
SELECT * FROM business_hours ORDER BY day_of_week;
SELECT * FROM day_exceptions ORDER BY date;
```

## 📝 Notas Importantes

1. **day_of_week**:
   - 0 = Domingo
   - 1 = Lunes
   - 2 = Martes
   - 3 = Miércoles
   - 4 = Jueves
   - 5 = Viernes
   - 6 = Sábado

2. **Formato de horas**: Usar formato 24 horas (HH:MM:SS)

3. **Días cerrados**: Poner `duration_minutes = 0`

4. **Prioridad**: Los días en `day_exceptions` tienen prioridad sobre `business_hours`

## 🚀 Resetear y Volver a Cargar

Si necesitas empezar de cero:

```bash
# Resetear base de datos y cargar seeders
php artisan migrate:fresh --seed
```

Esto eliminará todos los datos y volverá a crear las tablas con los datos de los seeders.
