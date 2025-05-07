import axios from './axiosConfig';

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

const crearTurnosEnTodasAreas = async () => {
  const areas = Object.keys(AREA_TO_BACKEND);

  for (const area of areas) {
    const { endpoint } = AREA_TO_BACKEND[area];
    const response = await axios.post(
      `turnos/${endpoint}`,
      {}
    );
    console.log(`Turno creado para ${AREA_TO_BACKEND[area].area}:`, response.data);
  }
};

// Llamar a la función
crearTurnosEnTodasAreas();