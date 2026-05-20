import { Server, Socket } from 'socket.io';
import { rooms } from '../managers/roomManager.js';
export const registerRaceEvents = (io: Server, socket: Socket) => {
  socket.on('player-ready', ({ roomCode, isReady }) => {
    const room = rooms.get(roomCode);
    if (!room) {
      return;
    }
    const player = room?.players.find((p) => p.socketId === socket.id);
    if (!player) {
      return;
    }
    player.ready = isReady;
    io.to(roomCode).emit('room_updated', room);
    const isAllReady = room.players.every((p) => p.ready);
    if (isAllReady) {
      room.text =
        'should stand how still little back time real say play give even if can much in as order say should same well great but end could there would set well down take no because which early show plan';
      room.raceStarted = true;
      const startTime = Date.now() + 5000;
      io.to(roomCode).emit('start-race', {
        text: room.text,
        startTime: startTime,
      });
    }
  });
  socket.on(
    'progress-update',
    ({
      roomCode,
      progress,
      wpm,
    }: {
      roomCode: string;
      progress: number;
      wpm: number;
    }) => {
      const room = rooms.get(roomCode);
      if (!room) {
        return;
      }
      const player = room?.players.find((p) => p.socketId === socket.id);
      if (!player) {
        return;
      }
      player.wpm = wpm;
      player.progress = progress;
      socket.to(roomCode).emit('opponent_progress', {
        username: player.username,
        socketId: socket.id,
        progress,
        wpm,
      });
    },
  );
};
