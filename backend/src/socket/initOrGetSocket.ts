import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { verifyToken } from '../utils/jwtUtils.js';
import cookie from 'cookie';
import signature from 'cookie-signature';
let io: Server;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });
  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || '');

      let token = cookies.token;

      if (!token) {
        return next(new Error('Unauthorized'));
      }

      if (token.startsWith('s:')) {
        token = token.slice(2);
      }

      const unsignedToken = signature.unsign(token, process.env.JWT_SECRET!);

      if (!unsignedToken) {
        return next(new Error('Invalid Cookie'));
      }

      const decoded = verifyToken(unsignedToken);
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Unauthorized'));
    }
  });
  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}
