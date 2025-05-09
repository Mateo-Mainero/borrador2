import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import styles from './login.module.scss';
import { jwtDecode } from "jwt-decode";

// Configuración global de axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3000/api';

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Configurar axios para incluir el token en todas las peticiones
const token = localStorage.getItem("authToken");
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

function Login() {
  const [formData, setFormData] = useState({
    usuario: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    setError(""); // Limpiar error al modificar campos
  };

  const checkTokenExpiration = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();
      return currentTime >= expirationTime;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return true;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post("/auth/login", formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Respuesta inválida del servidor');
      }

      if (checkTokenExpiration(token)) {
        setError("La sesión ha expirado. Por favor, inicia sesión nuevamente.");
        localStorage.removeItem("authToken");
        return;
      }

      // Guardar el token y configurar axios
      localStorage.setItem("authToken", token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Navegar según el rol
      switch (user.id_rol) {
        case 1:
          navigate("/admin");
          break;
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
          navigate("/users");
          break;
        default:
          setError("Rol de usuario no válido");
          break;
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
      
      let errorMessage = "Error al iniciar sesión";
      if (error.response) {
        errorMessage = error.response.data.error || "Error en el servidor";
      } else if (error.request) {
        errorMessage = "No se pudo conectar con el servidor";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      if (checkTokenExpiration(token)) {
        localStorage.removeItem("authToken");
      } else {
        // Si el token es válido, redirigir según el rol
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.idrol === 1) {
            navigate("/admin");
          } else {
            navigate("/users");
          }
        } catch (error) {
          localStorage.removeItem("authToken");
        }
      }
    }
  }, [navigate]);

  return (
    <div className={styles.loginContainer}>
      <a href="/contact" className={styles.contactLink}>Contactanos</a>
      <div className={styles.loginBox}>
        <div className="avatar-container">
          <Avatar
            alt="Foto de perfil"
            src=""
            sx={{ width: 100, height: 100, margin: "0 auto", marginBottom: "20px" }}
          />
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <div className={styles.formGroup}>
            <label htmlFor="usuario">Usuario:</label>
            <input
              type="text"
              id="usuario"
              value={formData.usuario}
              onChange={handleChange}
              placeholder="Ingresa tu usuario"
              disabled={loading}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              disabled={loading}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={loading ? styles.loading : ''}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;