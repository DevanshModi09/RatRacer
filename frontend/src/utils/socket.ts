import { io, Socket } from 'socket.io-client';
import type { OpponentProgress, RaceStanding, RoomState } from '../types';

interface ServerToClientEvents {
  room_created: (room: RoomState) => void;
  room_updated: (room: RoomState) => void;
  opponent_progress: (payload: OpponentProgress) => void;
  'start-race': (payload: { text: string; startTime: number }) => void;
  'race-results': (payload: { standings: RaceStanding[] }) => void;
  error_message: (message: string) => void;
}

interface ClientToServerEvents {
  'create-room': (payload: { username: string }) => void;
  'join-room': (payload: { roomCode: string; username: string }) => void;
  'leave-room': (payload: { roomCode: string }) => void;
  'player-ready': (payload: { roomCode: string; isReady: boolean }) => void;
  'progress-update': (payload: {
    roomCode: string;
    progress: number;
    wpm: number;
  }) => void;
  'race-finished-for-one-user': (payload: {
    roomCode: string;
    stats: { wpm: number; progress: number; accuracy: number };
  }) => void;
  rematch: (payload: { roomCode: string }) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_SERVER_URL,
  {
    autoConnect: false,
    withCredentials: true,
  },
);
