# Solución Error 419 - CSRF Token

## ✅ Cambios Realizados

### 1. Meta Tag CSRF en app.blade.php
Se agregó el meta tag CSRF en el `<head>`:
```html
<meta name="csrf-token" content="{{ csrf_token() }}">
```

### 2. Token CSRF en Inertia Props
Se agregó el token CSRF a las props compartidas de Inertia en `app/Http/Middleware/HandleInertiaRequests.php`:
```php
'csrf_token' => csrf_token(),
```

### 3. Mejora en ResumenModal.jsx
- Ahora obtiene el token desde Inertia props como primera opción
- Fallback al meta tag si no está disponible en props
- Mejor manejo de errores con mensajes específicos
- Se agregó console.log para debugging

## 🔧 Pasos para Solucionar

### 1. Limpiar Caché
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### 2. Recompilar Assets
```bash
npm run dev
```

o para producción:
```bash
npm run build
```

### 3. Verificar en el Navegador

1. Abre las **DevTools** (F12)
2. Ve a la pestaña **Console**
3. Intenta crear una cita
4. Verifica que aparezca el mensaje: `CSRF Token: [tu-token-aqui]`

### 4. Verificar el Meta Tag

En las DevTools:
1. Ve a la pestaña **Elements**
2. Busca en el `<head>` el meta tag:
```html
<meta name="csrf-token" content="...">
```

Si no aparece, significa que no se está cargando correctamente la vista.

## 🐛 Debugging Adicional

### Ver el request en Network

1. Abre **DevTools** → **Network**
2. Intenta crear una cita
3. Busca la petición a `/appointments`
4. Revisa:
   - **Headers** → Request Headers → `X-CSRF-TOKEN` (debe tener un valor)
   - **Response** → Si es 419, ver el mensaje de error

### Verificar que la ruta no esté bloqueada

Las rutas de appointments NO deben tener middleware de autenticación para usuarios públicos.

En `routes/web.php` las rutas deben estar así:
```php
Route::prefix('appointments')->group(function () {
    Route::post('/', [AppointmentController::class, 'store']);
    // ... otras rutas
});
```

Sin middleware `auth` alrededor.

## 🔒 Verificación de Sesiones

Si el problema persiste, verifica la configuración de sesiones:

### .env
```env
SESSION_DRIVER=file
SESSION_LIFETIME=120
```

### Permisos de storage
```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

## 🆘 Si Nada Funciona

### Opción 1: Deshabilitar CSRF temporalmente (SOLO PARA DESARROLLO)

**NO RECOMENDADO PARA PRODUCCIÓN**

Crear archivo `app/Http/Middleware/VerifyCsrfToken.php`:

```php
<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    protected $except = [
        'appointments*', // SOLO PARA DESARROLLO
    ];
}
```

Luego registrarlo en `bootstrap/app.php`.

### Opción 2: Usar Axios con configuración automática

Instalar Axios:
```bash
npm install axios
```

Configurar en `resources/js/bootstrap.js`:
```javascript
import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// CSRF token automático
let token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}
```

Luego usar axios en lugar de fetch en ResumenModal.

## ✅ Verificación Final

Después de aplicar los cambios:

1. ✅ Recargar la página (Ctrl + F5 o Cmd + Shift + R)
2. ✅ Abrir DevTools Console
3. ✅ Ver que aparezca el console.log del token
4. ✅ Intentar crear una cita
5. ✅ Verificar que se cree exitosamente

## 📝 Notas

- El error 419 significa que el token CSRF no se está enviando correctamente o ha expirado
- El token CSRF se regenera en cada sesión
- Si la sesión expira, el usuario debe recargar la página
- En producción, asegúrate de tener HTTPS configurado para sesiones seguras
