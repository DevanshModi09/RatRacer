import { Server, Socket } from 'socket.io';
import { rooms } from '../managers/roomManager.js';
import { Room, Player } from '../types/room.types.js';
import { generateRoomCode } from '../utils/generateRoomCode.js';
export const registerRoomEvents = (io: Server, socket: Socket) => {
  //CreateRoom
  io.on('create-room', ({ username }: { username: string }) => {
    const roomCode = generateRoomCode();
    const player: Player = {
      username,
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

  io.on(
    'join-room',
    ({ roomCode, username }: { roomCode: string; username: string }) => {},
  );
};
