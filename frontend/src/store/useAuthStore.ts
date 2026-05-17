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
      set({ authUser: res.data.user });
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
      set({ authUser: res.data.user });
      toast.success('Accout created sucessfully');
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        toast.error(
          'Backend server is not running , Please contact an admin on discord',
        );
        return;
      }
      const message = error?.response?.data?.msg || 'Something went wrong';
      toast.error(message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  //Login onClick
  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({ authUser: res.data.user });
      toast.success('Logged in successfully');
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        toast.error(
          'Backend server is not running , Please contact an admin on discord',
        );
        return;
      }
      const message = error?.response?.data?.msg || 'Something went wrong';
      toast.error(message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  //Logout OnClick
  logout: async () => {
    try {
      await axiosInstance.get('auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
  },
}));
