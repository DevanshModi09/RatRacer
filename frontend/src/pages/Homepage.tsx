import { useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/useRoomStore';
import { useAuthStore } from '../store/useAuthStore';
import { useState, useEffect, type FormEvent } from 'react';
import { DoorOpen, Plus, Zap, Coins, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

const Homepage = () => {
  const { createRoom, joinRoom, currentRoom } = useRoomStore();
  const { authUser } = useAuthStore();
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentRoom) navigate('/room-lobby');
  }, [currentRoom, navigate]);

  if (!authUser) return null;

  const handleJoin = (e: FormEvent) => {
    e.preventDefault();
    const code = roomCode.trim().toUpperCase();
    if (!code) {
      toast.error('Enter a room code first');
      return;
    }
    joinRoom(code, authUser.username);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Welcome back, {authUser.username}
          </h1>
          <p className="text-base-content/60">
            Create a room to start a race, or join one with a code.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-base-200 border border-base-300 rounded-2xl p-5 flex items-center gap-3">
            <Zap className="size-8 text-primary" aria-hidden="true" />
            <div>
              <p className="text-xs text-base-content/60">Best WPM</p>
              <p className="text-2xl font-bold font-race">{authUser.bestWpm}</p>
            </div>
          </div>
          <div className="bg-base-200 border border-base-300 rounded-2xl p-5 flex items-center gap-3">
            <Trophy className="size-8 text-primary" aria-hidden="true" />
            <div>
              <p className="text-xs text-base-content/60">Level</p>
              <p className="text-2xl font-bold font-race">{authUser.level}</p>
            </div>
          </div>
          <div className="bg-base-200 border border-base-300 rounded-2xl p-5 flex items-center gap-3">
            <Coins className="size-8 text-primary" aria-hidden="true" />
            <div>
              <p className="text-xs text-base-content/60">Coins</p>
              <p className="text-2xl font-bold font-race">{authUser.coins}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-base-200 border border-base-300 rounded-3xl p-8 flex flex-col items-center text-center gap-4">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Plus className="size-6 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Create a room</h2>
              <p className="text-base-content/60 text-sm mt-1">
                Start a new race and invite friends with the room code.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={() => createRoom(authUser.username)}
            >
              Create room
            </button>
          </div>

          <div className="bg-base-200 border border-base-300 rounded-3xl p-8 flex flex-col items-center text-center gap-4">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <DoorOpen className="size-6 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Join a room</h2>
              <p className="text-base-content/60 text-sm mt-1">
                Got a code from a friend? Drop it in below.
              </p>
            </div>
            <form onSubmit={handleJoin} className="w-full flex gap-2">
              <label htmlFor="room-code" className="sr-only">
                Room code
              </label>
              <input
                id="room-code"
                type="text"
                placeholder="ROOM CODE"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="input input-bordered w-full font-race tracking-widest text-center uppercase"
              />
              <button type="submit" className="btn btn-primary shrink-0">
                Join
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
