// src/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  autoConnect: false, // opcional: controlas cuándo conectar
});

export default socket;