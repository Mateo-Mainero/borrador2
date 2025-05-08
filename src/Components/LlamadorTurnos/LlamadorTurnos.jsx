import { useEffect, useState } from 'react';
import { socketService } from '../../Service/socketService';
import styles from './LlamadorTurnos.module.scss';
import logo1 from '../../assets/logo1.png';
import logo2 from '../../assets/logo2.png';

const LlamadorTurnos = () => {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    const socket = socketService.connect();
    if (!socket) return;

    // Escuchar la lista de turnos en vivo
    const turnosListener = (turnosRecibidos) => {
      console.log('Turnos recibidos:', turnosRecibidos);
      setTurnos(turnosRecibidos);
    };
    socket.on('turnosEnVivo', turnosListener);

    return () => {
      socket.off('turnosEnVivo', turnosListener);
      socketService.disconnect();
    };
  }, []);

  return (
    <div className={styles['tablet-container']}>
      <div className={styles['logo-container']}>
        <img src={logo1} alt="Logo" className={styles.logo} />
      </div>
      <div className={styles['text-one']}>
        <h1>Llamador de Turnos</h1>
      </div>
      <div className={styles['turns-table']}>
        <table className="table">
          <thead>
            <tr>
              <th>Turno</th>
              <th>Área</th>
              <th>Estado</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno) => (
              <tr key={turno.id_turno}>
                <td>{turno.turno}</td>
                <td>{turno.rol}</td>
                <td>{turno.turnoEstado}</td>
                <td>{new Date(turno.createdAt).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles['image-public']}>
        <img src={logo2} alt="Publicidad" />
      </div>
      <div className={styles['footer-text']}>
        E&M Systems. Todos los derechos reservados.
      </div>
    </div>
  );
};

export default LlamadorTurnos;