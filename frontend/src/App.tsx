import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import Leaderboard from './pages/Leaderboard';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import RoomLobbyPage from './pages/RoomLobbyPage';
import Homepage from './pages/Homepagee';
import { socket } from './utils/socket';
import Footer from './components/Footer';
import { useRoomStore } from './store/useRoomStore';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { initializeRoomListeners } = useRoomStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  useEffect(() => {
    if (authUser) {
      socket.connect();
    } else {
      socket.disconnect();
    }
    return () => {
      socket.disconnect();
    };
  }, [authUser]);
  useEffect(() => {
    initializeRoomListeners();
  }, []);
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div>
      <Navbar></Navbar>
      <main className="pt-16 pb-16">
        <Routes>
          <Route
            path="/"
            element={authUser ? <Homepage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/leaderboard"
            element={authUser ? <Leaderboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/room-lobby"
            element={authUser ? <RoomLobbyPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
      <Toaster />
      <Footer></Footer>
    </div>
  );
};
export default App;
