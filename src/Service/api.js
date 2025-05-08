import axiosInstance from '../axiosConfig';

// Servicios de autenticación
export const authService = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  getCurrentUser: () => axiosInstance.get('/auth/prueba'),
};

// Servicios de turnos
export const turnosService = {
  crearTurnoCaja: () => axiosInstance.post('/turnos/CrearTurnoCaja'),
  crearTurnoMesaDeEntrada: () => axiosInstance.post('/turnos/CrearTurnoMesaDeEntrada'),
  crearTurnoCobranza: () => axiosInstance.post('/turnos/CrearTurnoCobranza'),
  crearTurnoServiciosSociales: () => axiosInstance.post('/turnos/CrearTurnoServiciosSociales'),
  crearTurnoOtros: () => axiosInstance.post('/turnos/Otros'),
  updateTurno: (id, turnoData) => axiosInstance.patch(`/turnos/update/${id}`, { id_estado: turnoData.id_estado }),
  getUltimoTurno: (id) => axiosInstance.get(`/turnos/ultimoTurno/${id}`),
  getTurnosByRol: (id) => axiosInstance.get(`/turnos/turnosByIdRol/${id}`),
  crearTurnosEnTodasAreas: async () => {
    const areas = [
      { endpoint: 'crearTurnoCaja', area: 'Caja 1', id_rol: 2 },
      { endpoint: 'crearTurnoCaja', area: 'Caja 2', id_rol: 3 },
      { endpoint: 'crearTurnoMesaDeEntrada', area: 'Mesa de Entrada 1', id_rol: 4 },
      { endpoint: 'crearTurnoMesaDeEntrada', area: 'Mesa de Entrada 2', id_rol: 5 },
      { endpoint: 'crearTurnoMesaDeEntrada', area: 'Mesa de Entrada 3', id_rol: 6 },
      { endpoint: 'crearTurnoCobranza', area: 'Cobranzas 1', id_rol: 7 },
      { endpoint: 'crearTurnoCobranza', area: 'Cobranzas 2', id_rol: 8 },
      { endpoint: 'crearTurnoServiciosSociales', area: 'Servicios Sociales', id_rol: 9 },
      { endpoint: 'crearTurnoOtros', area: 'Otros', id_rol: 10 },
    ];

    const resultados = await Promise.allSettled(
      areas.map(area => turnosService[area.endpoint]())
    );

    return resultados.map((resultado, index) => ({
      area: areas[index].area,
      exito: resultado.status === 'fulfilled',
      data: resultado.status === 'fulfilled' ? resultado.value.data : resultado.reason
    }));
  }
};

// Servicios de usuarios
export const userService = {
  getUsers: () => axiosInstance.get('/usuarios/GetAll'),
  createUser: (userData) => axiosInstance.post('/usuarios/Create', userData),
  updateUser: (id, userData) => axiosInstance.patch(`/usuarios/update/${id}`, userData),
  deleteUser: (id) => axiosInstance.delete(`/usuarios/Delete/${id}`),
};

// Servicios de roles
export const rolService = {
  getRoles: () => axiosInstance.get('/rols/getRols'),
  updateEstadoRol: (id, estado) => axiosInstance.patch(`/rols/update/estado/${id}`, { estado }),
};