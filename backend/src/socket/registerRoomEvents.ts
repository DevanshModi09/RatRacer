import { Server, Socket } from 'socket.io';
import { rooms } from '../managers/roomManager.js';
import { Room, Player } from '../types/room.types.js';
import { generateRoomCode } from '../utils/generateRoomCode.js';
export const registerRoomEvents = (io: Server, socket: Socket) => {
  //CreateRoom
  socket.on('create-room', ({ username }: { username: string }) => {
    const roomCode = generateRoomCode();
    const player: Player = {
      userId: socket.data.user.userId,
      username: socket.data.user.username,
      ready: false,
      finished: false,
      wpm: 0,
      progress: 0,
      socketId: socket.id,
    };
    const room: Room = {
      roomCode,
      players: [player],
      raceStarted: false,
      createdAt: Date.now(),
    };
    rooms.set(roomCode, room);
    socket.join(roomCode);
    socket.emit('room_created', room);
  });

  socket.on(
    'join-room',
    ({ roomCode, username }: { roomCode: string; username: string }) => {
      const room = rooms.get(roomCode);
      if (!room) {
        socket.emit('error_message', 'Room not found');

        return;
      }
      if (room.raceStarted) {
        socket.emit('error_message', 'Race already started');

        return;
      }
      const player: Player = {
        username,
        ready: false,
        finished: false,
        wpm: 0,
        progress: 0,
        socketId: socket.id,
      };
      room.players.push(player);
      socket.join(roomCode);
      io.to(roomCode).emit('room_updated', room);
    },
  );
  socket.on('leave-room', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) {
      socket.emit('error_message', 'Room not found');
      return;
    }
    room.players = room.players.filter((p) => p.socketId !== socket.id);
    socket.leave(roomCode);
    if (room.players.length === 0) {
      rooms.delete(roomCode);
    }
    io.to(roomCode).emit('room_updated', room);
  });
};
