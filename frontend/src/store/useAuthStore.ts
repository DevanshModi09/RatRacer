import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
export const useAuthStore = create<any>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data });
      console.log(res.data);
    } catch (error) {
      console.log('Error in checkAuth:', error);

      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('auth/register', data);
      console.log(res.data);
      set({ authUser: res.data });
      toast.success('Accout created sucessfully');
    } catch (error) {
      console.log(error.response.data.msg);
      if (error.code === 'ERR_NETWORK') {
        toast.error('Backend server is not running');
        return;
      }
      const message = error?.response?.data?.msg || 'Something went wrong';
      toast.error(message);
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
