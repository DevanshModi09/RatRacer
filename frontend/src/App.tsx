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
import LandingPage from './pages/LandingPage';
import RacePage from './pages/RacePage';
import NotFoundPage from './pages/NotFoundPage';
import { socket } from './utils/socket';
import Footer from './components/Footer';
import { useRoomStore } from './store/useRoomStore';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { initializeRoomListeners, currentRoom } = useRoomStore();

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

  useEffect(() => initializeRoomListeners(), [initializeRoomListeners]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1 pt-16">
        <Routes>
          <Route
            path="/"
            element={authUser ? <Homepage /> : <LandingPage />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" replace />}
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/leaderboard"
            element={authUser ? <Leaderboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/room-lobby"
            element={
              authUser && currentRoom ? (
                <RoomLobbyPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/race"
            element={
              authUser && currentRoom ? <RacePage /> : <Navigate to="/" replace />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Toaster />
      <Footer />
    </div>
  );
};
export default App;
