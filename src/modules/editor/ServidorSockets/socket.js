// src/socket.js
import { io } from 'socket.io-client';

// Usa la variable de entorno para la URL del socket
const SOCKET_URL = import.meta.env.VITE_API_SOCKET_URL || 'http://localhost:3000';

export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  reconnection: true,
});