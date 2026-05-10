import { io } from 'socket.io-client';

export const connectWs = () => {
  const socket = io('http://localhost:3000');
  return socket;
};
