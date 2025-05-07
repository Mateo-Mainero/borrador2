import io from 'socket.io-client';

const backUrl = 'http://localhost:3000'; // Replace with your backend URL
let socket = null;

export const connectSocket = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error('No auth token found');
    return null;
  }

  if (!socket) {
    socket = io(backUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      transports: ['websocket', 'polling'], // Allow fallback to polling
      query: { authorization: token },
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      console.log('Token:', token);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.warn('Disconnected:', reason);
    });
  }
  return socket;
};

export const emit = (event, data) => {
  if (socket) {
    socket.emit(event, data);
  } else {
    console.error('Socket not connected');
  }
};

export const on = (event, callback) => {
  if (socket) {
    socket.on(event, callback);
  } else {
    console.error('Socket not connected');
  }
};

export const off = (event, callback) => {
  if (socket) {
    socket.off(event, callback);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};