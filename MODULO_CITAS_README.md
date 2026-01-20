# Módulo de Agenda / Citas - Clínica Dental

## Funcionalidades Implementadas

### ✅ Gestión Completa de Citas

El módulo de citas ahora cuenta con todas las funcionalidades solicitadas:

#### 1. **Calendario Interactivo**
- Vista semanal y mensual
- Navegación entre períodos
- Indicadores visuales de citas por día
- Botón "Hoy" para volver rápidamente a la fecha actual

#### 2. **Creación de Citas**
- Formulario completo con datos del paciente
- Selección de fecha y hora disponible
- Validaciones en tiempo real
- Verificación de disponibilidad de horarios
- Guardado automático en base de datos

#### 3. **Estados de Citas**
- **Programada**: Estado inicial al crear la cita
- **Confirmada**: Cuando se confirma la asistencia
- **Atendida**: Cuando el paciente fue atendido
- **No asistió**: Cuando el paciente no se presentó
- **Cancelada**: Cuando se cancela la cita

#### 4. **Reprogramación de Citas**
- Cambiar fecha y hora de citas existentes
- Verificación de disponibilidad en nuevo horario
- Interfaz intuitiva con selección de día y hora

#### 5. **Cancelación de Citas**
- Marcar citas como canceladas
- Libera el horario para otros pacientes

## Archivos Creados y Modificados

### Backend

#### Migración Actualizada
- `database/migrations/2025_11_26_170413_create_appointments_table.php`
  - Campos: datos del paciente, fecha, hora, estado, notas

#### Modelo
- `app/Models/Appointment.php`
  - Scopes para filtrar por estado, fecha y citas futuras
  - Relación con usuarios

#### Controlador
- `app/Http/Controllers/AppointmentController.php`
  - `index()`: Listar citas con filtros
  - `store()`: Crear nueva cita
  - `show()`: Ver detalle de una cita
  - `update()`: Actualizar/Reprogramar
  - `cancel()`: Cancelar cita
  - `confirm()`: Confirmar cita
  - `markAsAttended()`: Marcar como atendida
  - `markAsNoShow()`: Marcar como no asistió
  - `calendar()`: Obtener citas del mes para el calendario
  - `destroy()`: Eliminar cita

#### Rutas
- `routes/web.php`
  - Grupo de rutas `/appointments` con todas las operaciones CRUD

### Frontend

#### Componente de Reserva Actualizado
- `resources/js/componentswelcome/Turnos/ResumenModal.jsx`
  - Integración con API para guardar citas
  - Mensajes de éxito/error
  - Estado de carga

#### Componentes de Calendario
- `resources/js/componentswelcome/Calendario/CalendarioAgenda.jsx`
  - Vista semanal y mensual
  - Navegación entre períodos
  - Carga dinámica de citas

- `resources/js/componentswelcome/Calendario/CitaCard.jsx`
  - Tarjeta de cita con todas las operaciones
  - Menú contextual para acciones
  - Modal de detalles

- `resources/js/componentswelcome/Calendario/ModalReprogramar.jsx`
  - Interfaz para reprogramar citas
  - Selección de nueva fecha y hora
  - Validación de disponibilidad

## API Endpoints

### Listar Citas
```
GET /appointments
Query params:
  - status: programada|confirmada|atendida|no_asistio|cancelada
  - date: YYYY-MM-DD
  - future: true (solo citas futuras)
```

### Crear Cita
```
POST /appointments
Body:
{
  "patient_name": "Juan",
  "patient_lastname": "Pérez",
  "patient_dni": "12345678",
  "patient_phone": "1234567890",
  "patient_email": "juan@example.com",
  "payment_method": "Efectivo",
  "date": "2026-01-20",
  "time_start": "10:00",
  "time_end": "10:30",
  "notes": "Opcional"
}
```

### Obtener Citas del Calendario
```
GET /appointments/calendar?month=1&year=2026
```

### Ver Detalle de Cita
```
GET /appointments/{id}
```

### Actualizar/Reprogramar Cita
```
PUT /appointments/{id}
Body: (campos a actualizar)
{
  "date": "2026-01-21",
  "time_start": "14:00",
  "time_end": "14:30"
}
```

### Confirmar Cita
```
PATCH /appointments/{id}/confirm
```

### Cancelar Cita
```
PATCH /appointments/{id}/cancel
```

### Marcar como Atendida
```
PATCH /appointments/{id}/attended
```

### Marcar como No Asistió
```
PATCH /appointments/{id}/no-show
```

### Eliminar Cita
```
DELETE /appointments/{id}
```

## Uso del Componente de Calendario

Para usar el calendario en tu aplicación:

```jsx
import CalendarioAgenda from './componentswelcome/Calendario/CalendarioAgenda';

function MiComponente() {
  return (
    <div>
      <CalendarioAgenda />
    </div>
  );
}
```

## Características de Seguridad

- ✅ Validación de datos en backend y frontend
- ✅ Verificación de disponibilidad de horarios
- ✅ Protección CSRF en todas las peticiones
- ✅ Validación de formatos de email
- ✅ Sanitización de entradas

## Próximos Pasos (Opcional)

Algunas mejoras que podrías considerar:

1. **Notificaciones**
   - Email de confirmación al crear cita
   - Recordatorios 24h antes
   - SMS de confirmación

2. **Dashboard Administrativo**
   - Estadísticas de citas
   - Gráficos de asistencia
   - Reportes por período

3. **Historial de Pacientes**
   - Ver todas las citas de un paciente
   - Notas médicas
   - Tratamientos realizados

4. **Exportación**
   - Exportar agenda a PDF
   - Exportar listado de citas a Excel

## Instrucciones de Instalación

1. **Ejecutar migraciones**
```bash
php artisan migrate
```

2. **Configurar horarios de atención**
   - Agregar horarios en la tabla `business_hours`
   - Configurar excepciones en `day_exceptions` si es necesario

3. **Compilar assets**
```bash
npm run dev
```

## Notas Importantes

- Las citas canceladas no bloquean horarios
- Los horarios se generan automáticamente según la configuración en `business_hours`
- El sistema verifica disponibilidad antes de crear o reprogramar
- Todas las fechas se manejan en formato YYYY-MM-DD
- Las horas en formato HH:MM (24 horas)
