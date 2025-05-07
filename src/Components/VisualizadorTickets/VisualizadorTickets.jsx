import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../axiosConfig';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from './VisualizadorTickets.module.scss';
import logo1 from '../../assets/logo1.png';
import logo2 from '../../assets/logo2.png';

const socket = io('http://localhost:3000', {
  reconnection: false,
  transports: ['websocket'],
  upgrade: false,
  forceNew: true,
  timeout: 10000,
});

const AREAS = {
  'caja-1': 'Caja 1',
  'caja-2': 'Caja 2',
  'mesa-de-entrada-1': 'Mesa de Entrada 1',
  'mesa-de-entrada-2': 'Mesa de Entrada 2',
  'mesa-de-entrada-3': 'Mesa de Entrada 3',
  'cobranzas-1': 'Cobranzas 1',
  'cobranzas-2': 'Cobranzas 2',
  'servicios-sociales': 'Servicios Sociales',
  'otros': 'Otros',
};

const AREA_TO_BACKEND = {
  'caja-1': { endpoint: 'CrearTurnoCaja', area: 'Caja 1', id_rol: 2 },
  'caja-2': { endpoint: 'CrearTurnoCaja', area: 'Caja 2', id_rol: 3 },
  'mesa-de-entrada-1': { endpoint: 'CrearTurnoMesaDeEntrada', area: 'Mesa de Entrada 1', id_rol: 4 },
  'mesa-de-entrada-2': { endpoint: 'CrearTurnoMesaDeEntrada', area: 'Mesa de Entrada 2', id_rol: 5 },
  'mesa-de-entrada-3': { endpoint: 'CrearTurnoMesaDeEntrada', area: 'Mesa de Entrada 3', id_rol: 6 },
  'cobranzas-1': { endpoint: 'CrearTurnoCobranza', area: 'Cobranzas 1', id_rol: 7 },
  'cobranzas-2': { endpoint: 'CrearTurnoCobranza', area: 'Cobranzas 2', id_rol: 8 },
  'servicios-sociales': { endpoint: 'CrearTurnoServiciosSociales', area: 'Servicios Sociales', id_rol: 9 },
  'otros': { endpoint: 'Otros', area: 'Otros', id_rol: 10 },
};

const VisualizadorTickets = () => {
  const { area } = useParams();
  const navigate = useNavigate();
  const [ticketNumber, setTicketNumber] = useState(null);

  useEffect(() => {
    console.log('Área detectada:', area);

    socket.on('connect', () => {
      console.log('Conectado a Socket.IO con ID:', socket.id);
      socket.emit('register', { clientId: 'visualizador' });
      socket.emit('LastTurn', { area });
    });

    socket.on('connect_error', (error) => {
      console.error('Error de conexión con Socket.IO:', error.message);
    });

    socket.onAny((event, ...args) => {
      console.log(`Evento recibido: ${event}`, args);
    });

    socket.on('LastTurn', async () => {
      const backendArea = AREA_TO_BACKEND[area] || AREA_TO_BACKEND['otros'];
      console.log('Creando turno para:', backendArea);

      const response = await axios.post(
        `turnos/${backendArea.endpoint}`,
        {}
      );
      const { turno } = response.data;
      setTicketNumber(turno.turno.toString().padStart(4, '0'));

      const nuevoTurno = {
        id_turno: turno.id_turno,
        numero: turno.turno.toString().padStart(4, '0'),
        area: turno.area,
        estado: turno.estado,
        id_rol: backendArea.id_rol,
      };
      console.log('Emitiendo turnoSacado:', nuevoTurno);
      socket.emit('turnoSacado', nuevoTurno);

      console.log(`Turno creado para ${backendArea.area}: ${turno.turno}`);
      setTimeout(() => navigate('/menu'), 3000);
    });

    return () => {
      socket.off('LastTurn');
      socket.off('connect');
      socket.off('connect_error');
      socket.offAny();
      socket.disconnect();
    };
  }, [navigate, area]);

  const areaTitle = AREAS[area] || 'Área No Reconocida';

  return (
    <div className={styles['tablet-container']}>
      <div className={styles['logo-container']}>
        <img src={logo1} alt="Logo" className={styles.logo} />
      </div>
      <div className={styles['text-one']}>
        <h1>{areaTitle}</h1>
      </div>
      <div className={styles['ticket-number']}>
        TU NÚMERO DE TICKET ES: N° {ticketNumber || 'Cargando...'}
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

export default VisualizadorTickets;



