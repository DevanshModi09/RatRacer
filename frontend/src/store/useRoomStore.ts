import { create } from 'zustand';
import { socket } from '../utils/socket';
export const useRoomStore = create<any>((set) => ({
  currentRoom: null,
  isRoomLoading: true,
  players: [],
  isRaceStarted: false,
  isReady: false,
  initializeRoomListeners: () => {
    socket.on('room-updated', (room) => {
      set({
        currentRoom: room,
        players: room.players,
      });
    });
    socket.on('room_created', (room) => {
      console.log(room);
      set({
        currentRoom: room,
        players: room.players,
        isRoomLoading: false,
      });
    });
    socket.on('race-started', () => {
      set({
        isRaceStarted: true,
      });
    });
  },
  createRoom: (authUser) => {
    socket.emit('create-room', { username: authUser.username });
  },

  // setRoom: (roo(    )({
  //     currentRoom: room,
  //   }),

  setPlayers: (players) =>
    set({
      players,
    }),

  startRace: () =>
    set({
      isRaceStarted: true,
    }),

  leaveRoom: () =>
    set({
      currentRoom: null,
      players: [],
      isRaceStarted: false,
    }),
}));
