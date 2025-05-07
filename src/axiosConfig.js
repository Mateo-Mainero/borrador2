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
      errorMessage = error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    } else {
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

export default axiosInstance;