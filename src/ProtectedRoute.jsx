import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    // Redirige al login si no hay token
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decodificar el payload del token

    // Verifica si el usuario tiene el rol requerido
    if (roleRequired && decodedToken.idrol !== roleRequired) {
      return <Navigate to="/unauthorized" replace />; // Redirige si no tiene el rol adecuado
    }

    return children; // Permite el acceso si el token es válido y el rol coincide
  } catch (error) {
    console.error("Error decodificando el token:", error);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
