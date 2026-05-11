import { Server, Socket } from 'socket.io';

import { rooms } from '../managers/roomManager.js';

export function registerPlayerEvents(io: Server, socket: Socket) {
  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);

    for (const [roomCode, room] of rooms) {
      room.players = room.players.filter((p) => p.socketId !== socket.id);

      io.to(roomCode).emit('room_updated', room);

      if (room.players.length === 0) {
        rooms.delete(roomCode);
      }
    }
  });
}
