export interface Player {
  userId: number;
  socketId: string;
  username: string;
  ready: boolean;
  accuracy?: number;
  finishedAt?: number;
  progress: number;
  wpm: number;
  finished: boolean;
}

export interface Room {
  roomCode: string;
  players: Player[];
  raceEnded?: boolean;
  text?: string;
  raceStarted: boolean;
  createdAt: number;
}
