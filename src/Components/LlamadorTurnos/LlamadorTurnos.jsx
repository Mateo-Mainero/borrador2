import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import io from 'socket.io-client';
import axios from '../../axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './LlamadorTurnos.module.scss';
import logo1 from '../../assets/logo1.png';
import logo2 from '../../assets/logo2.png';
import logo3 from '../../assets/logo3.jpg';

const socket = io('http://localhost:3000', {
  reconnection: false,
  transports: ['websocket'],
  upgrade: false,
  forceNew: true,
  timeout: 10000,
});

const ROLES = [
  { id_rol: 2, name: 'Caja 1' },
  { id_rol: 3, name: 'Caja 2' },
  { id_rol: 4, name: 'Mesa de Entrada 1' },
  { id_rol: 5, name: 'Mesa de Entrada 2' },
  { id_rol: 6, name: 'Mesa de Entrada 3' },
  { id_rol: 7, name: 'Cobranzas 1' },
  { id_rol: 8, name: 'Cobranzas 2' },
  { id_rol: 9, name: 'Servicios Sociales' },
  { id_rol: 10, name: 'Otros' },
];

const LlamadorTurnos = () => {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    const fetchInitialTurnos = async () => {
      const turnosPromises = ROLES.map((rol) =>
        axios.get(`turnos/turnosByIdRol/${rol.id_rol}`)
      );
      const responses = await Promise.all(turnosPromises);
      const allTurnos = responses.flatMap((res) => res.data.turnos);
      const turnosValidos = allTurnos
        .filter(
          (turno) =>
            turno.estadoTurno === 'Pendiente' &&
            ROLES.some((rol) => rol.id_rol === turno.id_rol)
        )
        .map((turno) => ({
          id_turno: turno.id_turno,
          numero: turno.turno.toString().padStart(4, '0'),
          area: turno.rol,
          estado: turno.estadoTurno,
          id_rol: turno.id_rol || ROLES.find((r) => r.name === turno.rol)?.id_rol,
        }));
      setTurnos(turnosValidos);
    };
    fetchInitialTurnos();

    socket.on('connect', () => {
      console.log('Conectado a Socket.IO con ID:', socket.id);
      socket.emit('register', { clientId: 'llamador' });
    });

    socket.on('connect_error', (error) => {
      console.error('Error de conexión con Socket.IO:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error de Conexión',
        text: 'No se pudo conectar con el servidor de turnos. Verifica tu conexión.',
        timer: 5000,
        timerProgressBar: true,
      });
    });

    socket.onAny((event, ...args) => {
      console.log(`Evento recibido: ${event}`, args);
    });

    socket.on('turnosEnVivo', (data) => {
      console.log('Evento turnosEnVivo recibido:', data);
      const turnosValidos = data.turnos
        .filter(
          (turno) =>
            turno.estadoTurno === 'Pendiente' &&
            ROLES.some((rol) => rol.id_rol === turno.id_rol)
        )
        .map((turno) => ({
          id_turno: turno.id_turno,
          numero: turno.turno.toString().padStart(4, '0'),
          area: turno.rol,
          estado: turno.estadoTurno,
          id_rol: turno.id_rol || ROLES.find((r) => r.name === turno.rol)?.id_rol,
        }));
      setTurnos(turnosValidos);
    });

    return () => {
      socket.off('turnosEnVivo');
      socket.off('connect');
      socket.off('connect_error');
      socket.offAny();
      socket.disconnect();
    };
  }, []);

  const llamarTurno = async (numero, id_turno) => {
    await axios.patch(`turnos/update/${id_turno}`, {
      id_estado: 2,
    });
    const nuevosTurnos = turnos.filter((turno) => turno.id_turno !== id_turno);
    setTurnos(nuevosTurnos);
    socket.emit('turnoLlamado', {
      id_turno,
      numero,
      area: turnos.find((t) => t.id_turno === id_turno).area,
    });
    new Audio('https://www.soundjay.com/button/beep-07.wav').play();
    mostrarSweetAlert(numero, turnos.find((t) => t.id_turno === id_turno).area);
  };

  const mostrarSweetAlert = (turno, area) => {
    Swal.fire({
      title: `Llamando al Turno ${turno}`,
      text: `Área: ${area}`,
      imageUrl: logo1,
      imageWidth: 100,
      imageHeight: 100,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      backdrop: true,
    });
  };

  return (
    <div className={styles['tablet-container']}>
      <div className={styles['logo-container']}>
        <img src={logo3} alt="Logo" className={styles.logo} />
      </div>
      <div className={styles['table-container']}>
        <table className={`table table-bordered table-striped text-center ${styles.table}`}>
          <thead className="table-primary">
            <tr>
              <th>NUMERO</th>
              <th>ESTADO</th>
              <th>ÁREA</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {turnos.length === 0 ? (
              <tr>
                <td colSpan="4">No hay turnos en espera</td>
              </tr>
            ) : (
              turnos.map((turno) => (
                <tr key={turno.id_turno}>
                  <td>{turno.numero}</td>
                  <td className="text-success fw-bold">{turno.estado}</td>
                  <td>{turno.area}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => llamarTurno(turno.numero, turno.id_turno)}
                    >
                      Llamar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className={styles['image-public']}>
        <img src={logo2} alt="Publicidad" className={styles.publicidad} />
      </div>
      <div className={styles.footer}>
        <p className={styles['footer-text']}>© E&M Systems. Todos los derechos reservados</p>
      </div>
    </div>
  );
};

export default LlamadorTurnos;