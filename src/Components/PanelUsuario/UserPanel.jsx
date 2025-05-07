import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import io from "socket.io-client";
import styles from "./UserPanel.module.scss";

const socket = io("http://localhost:3000");

function UserPanel() {
  const navigate = useNavigate();
  const [turnoActual, setTurnoActual] = useState({
    id: 123,
    numero: "A-102",
    hora: "10:45",
    area: "Caja",
    estado: "ESPERA"
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      if (decoded.idrol === 1) navigate("/admin");
    } catch (err) {
      console.error("Token inválido", err);
      navigate("/login");
    }
  }, [navigate]);

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
      await axios.patch(`http://localhost:3000/turnos/update/${turnoActual.id}`, {
        estado: nuevoEstado
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });

      const turnoActualizado = { ...turnoActual, estado: nuevoEstado };
      socket.emit("estadoActualizado", turnoActualizado); // 🔴 Emitimos a todos los paneles

      if (nuevoEstado === "Finalizado") {
        setTurnoActual(null);
      } else {
        setTurnoActual(turnoActualizado); // Actualiza visualmente el estado
      }
    } catch (error) {
      console.error("Error al actualizar el estado del turno:", error);
      alert("No se pudo actualizar el turno.");
    }
  };

  return (
    <div className={styles.panelContainer}>
      <h1>Panel de Atención</h1>

      {turnoActual ? (
        <div id="turnoBox" className={styles.turnoBox}>
          <h2>Turno: <span>{turnoActual.numero}</span></h2>
          <p>Área: {turnoActual.area}</p>
          <p>Hora: {turnoActual.hora}</p>

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

export default UserPanel;


