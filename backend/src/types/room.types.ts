export interface Player {
  socketId: string;
  username: string;
  ready: boolean;
  progress: number;
  wpm: number;
  finished: boolean;
}

export interface Room {
  roomCode: string;
  players: Player[];
  text?: string;
  raceStarted: boolean;
  createdAt: number;
}
