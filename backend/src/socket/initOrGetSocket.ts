import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
let io: Server;
export function initSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });
  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }

  return io;
}
