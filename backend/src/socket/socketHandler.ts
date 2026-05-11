import { Server, Socket } from 'socket.io';
import { registerRoomEvents } from './registerRoomEvents.js';
// extending socket type
export const socketHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    registerRoomEvents(io, socket);
  });
};
