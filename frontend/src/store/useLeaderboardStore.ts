import { create } from 'zustand';
import { axiosInstance, getErrorMessage } from '../lib/axios';
import toast from 'react-hot-toast';
import type { LeaderboardEntry } from '../types';

interface LeaderboardStore {
  leaderboard: LeaderboardEntry[];
  isLeaderboardLoading: boolean;
  fetchLeaderboard: () => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardStore>((set) => ({
  leaderboard: [],
  isLeaderboardLoading: false,

  fetchLeaderboard: async () => {
    try {
      set({ isLeaderboardLoading: true });
      const res = await axiosInstance.get('/leaderboard/');
      set({ leaderboard: res.data.leaderboard });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not load the leaderboard'));
    } finally {
      set({ isLeaderboardLoading: false });
    }
  },
}));
