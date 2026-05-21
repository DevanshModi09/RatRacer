import { Link, useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/useRoomStore';
import { useAuthStore } from '../store/useAuthStore';
import { useState, useEffect } from 'react';

const Homepage = () => {
  const { createRoom, joinRoom, currentRoom } = useRoomStore();
  const { authUser } = useAuthStore();
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    if (currentRoom) {
      navigate('/room-lobby');
    }
  }, [currentRoom]);

  return (
    <div className="min-h-[calc(100vh-128px)] flex flex-col items-center justify-center gap-6">
      <Link
        to="/room-lobby"
        onClick={(e) => {
          e.preventDefault();
          createRoom(authUser);
        }}
        className="btn bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700"
      >
        Create Room
      </Link>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="input input-bordered"
        />

        <Link
          to="/room-lobby"
          onClick={(e) => {
            e.preventDefault();
            joinRoom(roomCode, authUser.username);
          }}
          className="btn bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700"
        >
          Join Room
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
