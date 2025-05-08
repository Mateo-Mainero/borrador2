import { useEffect, useState } from 'react';
import { socketService } from '../../Service/socketService';
import styles from './VisualizadorTickets.module.scss';
import logo1 from '../../assets/logo1.png';
import logo2 from '../../assets/logo2.png';

const VisualizadorTickets = () => {
  const [ultimoTurno, setUltimoTurno] = useState(null);

  useEffect(() => {
    const socket = socketService.connect();
    if (!socket) return;

    // Escuchar la respuesta del último turno
    const lastTurnListener = (turno) => {
      console.log('Último turno recibido:', turno);
      setUltimoTurno(turno);
    };
    socket.on('LastTurn', lastTurnListener);

    // Solicitar el último turno
    socket.emit('LastTurn');

    return () => {
      socket.off('LastTurn', lastTurnListener);
      socketService.disconnect();
    };
  }, []);

  return (
    <div className={styles['tablet-container']}>
      <div className={styles['logo-container']}>
        <img src={logo1} alt="Logo" className={styles.logo} />
      </div>
      <div className={styles['text-one']}>
        <h1>Visualizador de Tickets</h1>
      </div>
      {ultimoTurno && (
        <div className={styles['ticket-info']}>
          <h2>Su turno es:</h2>
          <div className={styles['ticket-number']}>{ultimoTurno.turno}</div>
          <div className={styles['ticket-area']}>Área: {ultimoTurno.area}</div>
          <div className={styles['ticket-status']}>Estado: {ultimoTurno.estado}</div>
        </div>
      )}
      <div className={styles['image-public']}>
        <img src={logo2} alt="Publicidad" />
      </div>
      <div className={styles['footer-text']}>
        E&M Systems. Todos los derechos reservados.
      </div>
    </div>
  );
};

export default VisualizadorTickets;



