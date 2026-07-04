import { create } from 'zustand';
import toast from 'react-hot-toast';
import { socket } from '../utils/socket';
import type { OpponentProgress, Player, RaceStanding, RoomState } from '../types';

interface RoomStore {
  currentRoom: RoomState | null;
  players: Player[];
  isRoomLoading: boolean;
  isRaceStarted: boolean;
  hasFinishedTyping: boolean;
  countdown: number | null;
  raceText: string;
  startTime: number | null;
  opponentsStats: Record<string, OpponentProgress>;
  raceResults: RaceStanding[] | null;

  setCountdown: (countdown: number) => void;
  initializeRoomListeners: () => () => void;
  createRoom: (username: string) => void;
  joinRoom: (roomCode: string, username: string) => void;
  leaveRoom: (roomCode: string) => void;
  toggleReady: (roomCode: string, nextReady: boolean) => void;
  setProgressUpdate: (roomCode: string, progress: number, wpm: number) => void;
  finishRace: (
    roomCode: string,
    stats: { wpm: number; progress: number; accuracy: number },
  ) => void;
  rematch: (roomCode: string) => void;
  resetRoom: () => void;
}

const initialRaceState = {
  isRaceStarted: false,
  hasFinishedTyping: false,
  countdown: null as number | null,
  raceText: '',
  startTime: null as number | null,
  opponentsStats: {} as Record<string, OpponentProgress>,
  raceResults: null as RaceStanding[] | null,
};

export const useRoomStore = create<RoomStore>((set, get) => ({
  currentRoom: null,
  players: [],
  isRoomLoading: true,
  ...initialRaceState,

  setCountdown: (countdown) => set({ countdown }),

  initializeRoomListeners: () => {
    const onRoomUpdated = (room: RoomState) => {
      set({ currentRoom: room, players: room.players, isRoomLoading: false });
    };
    const onRoomCreated = (room: RoomState) => {
      set({ currentRoom: room, players: room.players, isRoomLoading: false });
    };
    const onOpponentProgress = (payload: OpponentProgress) => {
      set((state) => ({
        opponentsStats: {
          ...state.opponentsStats,
          [payload.socketId]: payload,
        },
      }));
    };
    const onStartRace = ({ text, startTime }: { text: string; startTime: number }) => {
      set({
        isRaceStarted: true,
        raceText: text,
        startTime,
        hasFinishedTyping: false,
        raceResults: null,
        opponentsStats: {},
      });
    };
    const onRaceResults = ({ standings }: { standings: RaceStanding[] }) => {
      set({ raceResults: standings });
    };
    const onErrorMessage = (message: string) => {
      toast.error(message);
    };

    socket.on('room_updated', onRoomUpdated);
    socket.on('room_created', onRoomCreated);
    socket.on('opponent_progress', onOpponentProgress);
    socket.on('start-race', onStartRace);
    socket.on('race-results', onRaceResults);
    socket.on('error_message', onErrorMessage);

    return () => {
      socket.off('room_updated', onRoomUpdated);
      socket.off('room_created', onRoomCreated);
      socket.off('opponent_progress', onOpponentProgress);
      socket.off('start-race', onStartRace);
      socket.off('race-results', onRaceResults);
      socket.off('error_message', onErrorMessage);
    };
  },

  createRoom: (username) => {
    set({ isRoomLoading: true });
    socket.emit('create-room', { username });
  },

  joinRoom: (roomCode, username) => {
    set({ isRoomLoading: true });
    socket.emit('join-room', { roomCode, username });
  },

  leaveRoom: (roomCode) => {
    socket.emit('leave-room', { roomCode });
    get().resetRoom();
  },

  toggleReady: (roomCode, nextReady) => {
    socket.emit('player-ready', { roomCode, isReady: nextReady });
  },

  setProgressUpdate: (roomCode, progress, wpm) => {
    socket.emit('progress-update', { roomCode, progress, wpm: Math.round(wpm) });
  },

  finishRace: (roomCode, stats) => {
    set({ hasFinishedTyping: true });
    socket.emit('race-finished-for-one-user', { roomCode, stats });
  },

  rematch: (roomCode) => {
    socket.emit('rematch', { roomCode });
  },

  resetRoom: () => {
    set({
      currentRoom: null,
      players: [],
      isRoomLoading: true,
      ...initialRaceState,
    });
  },
}));
