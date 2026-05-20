import { Server, Socket } from 'socket.io';
import { registerRoomEvents } from './registerRoomEvents.js';
import { registerRaceEvents } from './registerRaceEvents.js';
import { registerPlayerEvents } from './registerPlayerEvents.js';
export const socketHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('user connected :', socket.id);
    registerRoomEvents(io, socket);
    registerRaceEvents(io, socket);
    registerPlayerEvents(io, socket);
  });
};
