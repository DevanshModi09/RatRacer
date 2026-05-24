import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

type LeaderboardUser = {
  username: string;
  bestWpm: number;
  avgWpm: number;
  totalWins: number;
  totalRaces: number;
  level: number;
};

type LeaderboardStore = {
  leaderboard: LeaderboardUser[];

  isLeaderboardLoading: boolean;

  fetchLeaderboard: () => Promise<void>;
};

export const useLeaderboardStore = create<LeaderboardStore>((set) => ({
  leaderboard: [],

  isLeaderboardLoading: false,

  fetchLeaderboard: async () => {
    try {
      set({
        isLeaderboardLoading: true,
      });
      const res = await axiosInstance.get('/leaderboard/', {
        withCredentials: true,
      });
      set({
        leaderboard: res.data.leaderboard,
      });
    } catch (err) {
      console.log(err);
    } finally {
      set({
        isLeaderboardLoading: false,
      });
    }
  },
}));
