// src/socket.js

import { io } from 'socket.io-client';

// Conexión al servidor de sockets (ajusta la URL según tu backend)
export const socket = io('http://localhost:8080', {
  transports: ['websocket'], // Evita problemas con polling
  reconnection: true,
});

