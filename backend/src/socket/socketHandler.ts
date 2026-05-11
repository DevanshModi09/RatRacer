import { Server, Socket } from 'socket.io';
import { registerRoomEvents } from './registerRoomEvents.js';
import { registerRaceEvents } from './registerRaceEvents.js';
import { registerPlayerEvents } from './registerPlayerEvents.js';
// extending socket type
export const socketHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    registerRoomEvents(io, socket);
    registerRaceEvents(io, socket);
    registerPlayerEvents(io, socket);
  });
};
