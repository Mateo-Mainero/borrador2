import axios from 'axios';
import Swal from 'sweetalert2';

// Crear una instancia de axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    accept: '*/*',
  },
});

// Interceptor para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';

    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          errorMessage = data.message || 'Solicitud incorrecta';
          break;
        case 401:
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
          // Opcional: redirigir al login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          errorMessage = 'No tienes permisos para realizar esta acción';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = data.message || `Error ${status}: ${error.response.statusText}`;
      }
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    } else {
      // Algo ocurrió al configurar la petición
      errorMessage = `Error: ${error.message}`;
    }

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
    });

    return Promise.reject(error);
  }
);

// Interceptor para agregar el token de autenticación
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;