import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from './Service/api';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const response = await authService.getCurrentUser();
        if (response.data) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
      }
    };

    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    // Mostrar un indicador de carga mientras se verifica la autenticación
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    // Redirigir al login y guardar la ubicación actual para redirigir después del login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
