export type Role = 'USER' | 'ADMIN';

export interface AuthUser {
  username: string;
  userId: number;
  role: Role;
  email: string;
  isVerified: boolean;
  xp: number;
  level: number;
  coins: number;
  bestWpm: number;
  avgWpm: number;
  totalRaces: number;
  totalWins: number;
}

export interface Player {
  userId: number;
  socketId: string;
  username: string;
  ready: boolean;
  accuracy: number;
  finishedAt: number;
  progress: number;
  wpm: number;
  finished: boolean;
}

export interface RoomState {
  roomCode: string;
  players: Player[];
  raceEnded: boolean;
  text: string;
  raceStarted: boolean;
  createdAt: number;
}

export interface OpponentProgress {
  username: string;
  socketId: string;
  progress: number;
  wpm: number;
}

export interface RaceStanding {
  username: string;
  wpm: number;
  accuracy: number;
  position: number;
  xpEarned: number;
  coinsEarned: number;
}

export interface LeaderboardEntry {
  username: string;
  bestWpm: number;
  avgWpm: number;
  totalWins: number;
  totalRaces: number;
  level: number;
}
