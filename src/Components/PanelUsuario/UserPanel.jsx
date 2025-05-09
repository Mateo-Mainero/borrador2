import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import io from "socket.io-client";
import styles from "./UserPanel.module.scss";

const socket = io("http://localhost:3000");

function UserPanel() {
  const navigate = useNavigate();
  const [turnoActual, setTurnoActual] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      if (decoded.idrol === 1) navigate("/admin");
      setUserInfo(decoded);
      cargarTurnoEnEspera();
    } catch (err) {
      console.error("Token inválido", err);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    socket.on("turnoActualizado", (turno) => {
      if (turno.area === userInfo?.area) {
        setTurnoActual(turno);
      }
    });

    return () => {
      socket.off("turnoActualizado");
    };
  }, [userInfo]);

  const cargarTurnoEnEspera = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:3000/api/turnos/en-espera", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.length > 0) {
        setTurnoActual(response.data[0]);
      }
    } catch (error) {
      console.error("Error al cargar turno en espera:", error);
    }
  };

  const handleLlamar = () => {
    const audio = new Audio("https://www.myinstants.com/media/sounds/bell.mp3");
    audio.play();

    const box = document.getElementById("turnoBox");
    if (box) {
      box.classList.add(styles.llamando);
      setTimeout(() => {
        box.classList.remove(styles.llamando);
      }, 1500);
    }

    handleEstado("LLAMANDO");
  };

  const handleEstado = async (nuevoEstado) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.patch(
        `http://localhost:3000/api/turnos/update/${turnoActual._id}`,
        { estado: nuevoEstado },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const turnoActualizado = response.data;
      socket.emit("turnoActualizado", turnoActualizado);

      if (nuevoEstado === "FINALIZADO") {
        setTurnoActual(null);
        cargarTurnoEnEspera();
      } else {
        setTurnoActual(turnoActualizado);
      }
    } catch (error) {
      console.error("Error al actualizar el estado del turno:", error);
      alert("No se pudo actualizar el turno.");
    }
  };

  return (
    <div className={styles.panelContainer}>
      <h1>Panel de Atención</h1>
      {userInfo && <p>Área: {ROLES[userInfo.idrol]}</p>}

      {turnoActual ? (
        <div id="turnoBox" className={styles.turnoBox}>
          <h2>Turno: <span>{turnoActual.numero}</span></h2>
          <p>Área: {turnoActual.area}</p>
          <p>Hora: {turnoActual.hora}</p>
          <p>Estado: {turnoActual.estado}</p>

          <div className={styles.botones}>
            <button onClick={handleLlamar}>📢 Llamar</button>
            <button onClick={() => handleEstado("ATENDIDO")}>🧍‍♂️ Atendido</button>
            <button onClick={() => handleEstado("FINALIZADO")}>✅ Finalizado</button>
          </div>
        </div>
      ) : (
        <p>No hay turnos en espera</p>
      )}
    </div>
  );
}

const ROLES = {
  1: "Administrador",
  2: "Caja 1",
  3: "Caja 2",
  4: "Mesa De Entrada 1",
  5: "Mesa De Entrada 2",
  6: "Mesa De Entrada 3",
  7: "Cobranzas 1",
  8: "Cobranzas 2",
  9: "Servicios Sociales",
  10: "Otros"
};

export default UserPanel;


