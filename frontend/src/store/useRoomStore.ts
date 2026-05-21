import { create } from 'zustand';
import { socket } from '../utils/socket';
export const useRoomStore = create<any>((set) => ({
  raceText: null,
  startTime: null,
  endTime: null,
  currentRoom: null,
  players: [],
  isRoomLoading: true,
  isRaceStarted: false,
  isRaceFinished: false,
  countdown: null,
  isReady: false,
  opponentsStats: {},
  winner: null,
  raceResults: [],
  initializeRoomListeners: () => {
    socket.on('room_updated', (room) => {
      set({
        currentRoom: room,
        players: room.players,
        isRoomLoading: false,
      });
    });
    socket.on('room_created', (room) => {
      set({
        currentRoom: room,
        players: room.players,
        isRoomLoading: false,
      });
    });
    socket.on('start-race', ({ text, startTime }) => {
      set({
        isRaceStarted: true,
        raceText: text,
        startTime: startTime,
      });
    });
  },
  createRoom: (authUser) => {
    socket.emit('create-room', { username: authUser.username });
  },
  joinRoom: (roomCode, username) => {
    socket.emit('join-room', { roomCode, username });
  },
  leaveRoom: (roomCode) => {
    socket.emit('leave-room', { roomCode });
    set({
      currentRoom: null,
      players: [],
      isReady: false,
      isRaceStarted: false,
      isRaceFinished: false,
      raceText: null,
    });
  },
  setReady: (roomCode, isReady) => {
    set({
      isReady: !isReady,
    });
    socket.emit('player-ready', { roomCode, isReady: !isReady });
  },
  setPlayers: (players) =>
    set({
      players,
    }),
}));
