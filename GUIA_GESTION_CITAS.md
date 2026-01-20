# Guía de Gestión de Citas

## 📋 ¿Cómo Acceder?

### Para Administradores (Usuarios Autenticados)

1. **Inicia sesión** en tu cuenta
2. **Ve al menú de navegación** superior
3. **Haz clic en "Gestión de Citas"**
4. Accede directamente desde: `http://tu-dominio.com/gestion-citas`

## 🎯 Funcionalidades Disponibles

### Vista Calendario

La vista de calendario te permite ver todas las citas organizadas por fecha:

#### **Vista Mensual**
- Ver todas las citas del mes
- Indicadores de color según el estado
- Click en cualquier día para ver detalles

#### **Vista Semanal**
- Vista más detallada de la semana
- Tarjetas de citas con información completa
- Acciones rápidas para cada cita

### Vista Lista

La vista de lista ofrece una perspectiva más detallada con:

#### **Estadísticas Rápidas**
- Total de citas programadas
- Total de citas confirmadas
- Total de citas atendidas
- Total de no asistencias

#### **Filtros Avanzados**
- **Buscar**: Por nombre, apellido, DNI, teléfono o email
- **Estado**: Filtrar por programada, confirmada, atendida, no asistió, cancelada
- **Fecha**: Ver citas de un día específico
- **Limpiar filtros**: Botón para resetear todos los filtros

#### **Lista Agrupada por Fecha**
- Citas ordenadas por fecha (más recientes primero)
- Agrupadas por día con encabezado
- Ordenadas por hora dentro de cada día

## 🎨 Estados de las Citas

### 🟡 Programada
- **Color**: Amarillo
- **Descripción**: Cita recién creada, pendiente de confirmación
- **Acciones disponibles**:
  - ✅ Confirmar
  - 🔄 Reprogramar
  - ✓ Marcar como atendida
  - ❌ Marcar como no asistió
  - 🗑️ Cancelar
  - 🗑️ Eliminar

### 🟢 Confirmada
- **Color**: Verde
- **Descripción**: Paciente confirmó su asistencia
- **Acciones disponibles**:
  - 🔄 Reprogramar
  - ✓ Marcar como atendida
  - ❌ Marcar como no asistió
  - 🗑️ Cancelar
  - 🗑️ Eliminar

### 🔵 Atendida
- **Color**: Azul
- **Descripción**: Paciente fue atendido
- **Acciones disponibles**:
  - 👁️ Ver detalles
  - 🗑️ Eliminar

### 🔴 No Asistió
- **Color**: Rojo
- **Descripción**: Paciente no se presentó a la cita
- **Acciones disponibles**:
  - 👁️ Ver detalles
  - 🗑️ Eliminar

### ⚫ Cancelada
- **Color**: Gris
- **Descripción**: Cita cancelada
- **Acciones disponibles**:
  - 👁️ Ver detalles
  - 🗑️ Eliminar

## 🔧 Operaciones Disponibles

### 1. Ver Detalles de una Cita

- **Clic en cualquier tarjeta de cita**
- Se abre un modal con:
  - Nombre completo del paciente
  - DNI
  - Teléfono
  - Email
  - Método de pago
  - Fecha y hora
  - Estado actual
  - Notas (si hay)

### 2. Confirmar una Cita

1. Encuentra la cita con estado "Programada"
2. Haz clic en el menú de opciones (⋮)
3. Selecciona "Confirmar"
4. El estado cambia a "Confirmada" (verde)

### 3. Reprogramar una Cita

1. Haz clic en el menú de opciones (⋮)
2. Selecciona "Reprogramar"
3. Se abre un modal lateral
4. Selecciona la nueva fecha
5. Selecciona la nueva hora
6. Confirma la reprogramación

**Notas**:
- Solo se muestran fechas y horarios disponibles
- No se puede reprogramar para fechas pasadas
- El sistema verifica que no haya conflictos

### 4. Marcar como Atendida

1. Cuando el paciente haya sido atendido
2. Menú de opciones (⋮) → "Marcar atendida"
3. El estado cambia a "Atendida" (azul)

### 5. Marcar como No Asistió

1. Si el paciente no se presentó
2. Menú de opciones (⋮) → "No asistió"
3. El estado cambia a "No asistió" (rojo)

### 6. Cancelar una Cita

1. Menú de opciones (⋮) → "Cancelar"
2. El estado cambia a "Cancelada" (gris)
3. **Importante**: Las citas canceladas liberan el horario para otros pacientes

### 7. Eliminar una Cita

1. Menú de opciones (⋮) → "Eliminar"
2. Confirma la acción
3. La cita se elimina permanentemente
4. **¡Cuidado!**: Esta acción no se puede deshacer

## 💡 Consejos de Uso

### Flujo Recomendado

1. **Al recibir una reserva online**:
   - Estado inicial: "Programada" (amarillo)
   - Contactar al paciente para confirmar

2. **Cuando el paciente confirma**:
   - Cambiar a "Confirmada" (verde)

3. **El día de la cita**:
   - Si asistió: Marcar como "Atendida" (azul)
   - Si no asistió: Marcar como "No asistió" (rojo)
   - Si cancela: Marcar como "Cancelada" (gris)

### Mejores Prácticas

✅ **Hacer**:
- Confirmar citas 24-48 horas antes
- Actualizar estados inmediatamente después de la atención
- Usar la búsqueda para encontrar pacientes rápidamente
- Revisar el calendario semanalmente para planificar

❌ **Evitar**:
- Eliminar citas sin confirmar primero
- Dejar citas en "Programada" por mucho tiempo
- Reprogramar sin contactar al paciente

## 📊 Reportes y Estadísticas

### En la Vista Lista

Verás automáticamente:
- Cantidad de citas programadas
- Cantidad de citas confirmadas
- Cantidad de citas atendidas
- Cantidad de no asistencias

### Filtros Útiles

**Ver citas del día**:
- Filtro de fecha → Selecciona hoy
- Estado → "Confirmada"

**Ver no asistencias del mes**:
- Estado → "No asistió"
- Sin filtro de fecha

**Buscar paciente específico**:
- Barra de búsqueda → Escribe nombre o DNI

## 🚀 Atajos de Teclado (Próximamente)

## 🔐 Permisos

- **Usuarios autenticados**: Acceso completo a gestión de citas
- **Usuarios no autenticados**: Solo pueden crear citas desde la página principal

## 📱 Responsive

La interfaz funciona perfectamente en:
- ✅ Computadoras de escritorio
- ✅ Tablets
- ✅ Teléfonos móviles

## 🆘 Preguntas Frecuentes

### ¿Puedo recuperar una cita eliminada?
No, las eliminaciones son permanentes. Usa "Cancelar" si quieres mantener el registro.

### ¿Las citas canceladas bloquean horarios?
No, las citas canceladas liberan automáticamente el horario.

### ¿Puedo reprogramar una cita atendida?
No, las citas atendidas no se pueden reprogramar. Deberías crear una nueva cita.

### ¿Cómo veo todas las citas de un paciente?
Usa la barra de búsqueda y escribe el nombre o DNI del paciente.

### ¿Se notifica al paciente cuando cambio el estado?
Actualmente no. Las notificaciones automáticas son una mejora futura.

## 🔜 Próximas Mejoras

- [ ] Notificaciones por email/SMS
- [ ] Exportar a PDF/Excel
- [ ] Historial de cambios
- [ ] Notas por cita
- [ ] Recordatorios automáticos
- [ ] Vista de agenda diaria imprimible
