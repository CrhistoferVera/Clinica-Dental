import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['Accept'] = 'application/json';

// Configurar credenciales para cookies de sesión
window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;

// Función para obtener CSRF token fresco del meta tag
const getCSRFToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.content : '';
};

// Interceptor para añadir CSRF token fresco en cada request
window.axios.interceptors.request.use(config => {
    config.headers['X-CSRF-TOKEN'] = getCSRFToken();
    return config;
});

// Interceptor para manejar errores 419 (CSRF token mismatch)
window.axios.interceptors.response.use(
    response => {
        // Limpiar flag de recarga en requests exitosos
        sessionStorage.removeItem('_csrf_reload');
        return response;
    },
    error => {
        if (error.response?.status === 419) {
            const yaRecargo = sessionStorage.getItem('_csrf_reload');
            if (!yaRecargo) {
                // Primera vez: recargar para obtener token fresco
                sessionStorage.setItem('_csrf_reload', '1');
                window.location.reload();
            } else {
                // Ya se recargó y sigue fallando: limpiar flag y dejar que el componente maneje el error
                sessionStorage.removeItem('_csrf_reload');
            }
        }
        return Promise.reject(error);
    }
);
