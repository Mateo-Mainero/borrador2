import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    if (this.socket?.connected) {
      console.log('Socket ya conectado, reutilizando conexión');
      return this.socket;
    }

    try {
      console.log('Intentando conectar al servidor WebSocket...');
      this.socket = io('http://localhost:3000', {
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 2000,
        timeout: 10000,
        transports: ['websocket']
      });

      this.setupEventListeners();
      return this.socket;
    } catch (error) {
      console.error('Error al conectar con Socket.IO:', error);
      return null;
    }
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Conectado al servidor de turnos');
      console.log('ID del socket:', this.socket.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Máximo número de intentos de reconexión alcanzado');
        this.disconnect();
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Desconectado:', reason);
      if (reason === 'io server disconnect') {
        console.log('El servidor forzó la desconexión, intentando reconectar...');
        this.socket.connect();
      }
    });

    this.socket.on('error', (error) => {
      console.error('Error en Socket.IO:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      console.log('Desconectando socket...');
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      console.log(`Emitiendo evento ${event}:`, data);
      this.socket.emit(event, data);
    } else {
      console.error('Socket no está conectado');
      this.connect();
    }
  }

  on(event, callback) {
    if (this.socket?.connected) {
      console.log(`Registrando listener para evento ${event}`);
      this.socket.on(event, callback);
      this.listeners.set(event, callback);
    } else {
      console.error('Socket no está conectado');
    }
  }

  off(event) {
    if (this.socket?.connected && this.listeners.has(event)) {
      console.log(`Removiendo listener para evento ${event}`);
      this.socket.off(event, this.listeners.get(event));
      this.listeners.delete(event);
    }
  }

  removeAllListeners() {
    if (this.socket?.connected) {
      console.log('Removiendo todos los listeners');
      this.listeners.forEach((callback, event) => {
        this.socket.off(event, callback);
      });
      this.listeners.clear();
    }
  }
}

export const socketService = new SocketService();