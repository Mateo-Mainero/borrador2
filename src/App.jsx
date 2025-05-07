import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login"; // Componente Login
import AdminPanel from "./AdminPanel"; // Componente del Panel de Administrador
import UserPanel from "./Components/PanelUsuario/UserPanel"; // Cambia la importación aquí
import MenuPrincipal from "./Components/MenuPrincipal/MenuPrincipal";
import PagoServicios from "./Components/PagoServicios/PagoServicios";
import MesaDeEntrada from "./Components/MesaDeEntrada/MesaDeEntrada"; 
import CuentasCorrientes from "./Components/Cobranzas/CuentasCorrientes";
import ServiciosSociales from "./Components/ServiciosSociales/ServiciosSociales";
import OtrosFacturacion from "./Components/Otros/Otros";
import VisualizadorTickets from "./Components/VisualizadorTickets/VisualizadorTickets";
import LlamadorTurnos from "./Components/LlamadorTurnos/LlamadorTurnos"


// Componente de protección de rutas (requiere autenticación)
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("authToken");
  return token ? element : <Navigate to="/" />;
};


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Ruta principal (login) */}
          <Route path="/admin" element={<AdminPanel />} /> {/* Ruta para el panel de administrador */}
          <Route path="/users" element={<UserPanel />} /> {/* Cambia la ruta aquí */}
          <Route path="/menu" element={<MenuPrincipal />} />
          <Route path="/servicios" element={<PagoServicios />} />
          <Route path="/mesa-de-entrada" element={<MesaDeEntrada />} />
        <Route path="/cobranzas" element={<CuentasCorrientes/>} />
        <Route path="/servicios-sociales" element={<ServiciosSociales/>} />
        <Route path="/otros-facturacion" element={<OtrosFacturacion/>} />
        <Route path="/visualizador-ticket/:area" element={<VisualizadorTickets />} />
        <Route path="/visualizador-tickets" element={<LlamadorTurnos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



