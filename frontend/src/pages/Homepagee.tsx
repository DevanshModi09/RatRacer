import { Link } from 'react-router-dom';
import { useRoomStore } from '../store/useRoomStore';
import { useAuthStore } from '../store/useAuthStore';
import { useState } from 'react';

const Homepage = () => {
  const { createRoom, joinRoom } = useRoomStore();
  const { authUser } = useAuthStore();

  const [roomCode, setRoomCode] = useState('');

  return (
    <div className="min-h-[calc(100vh-128px)] flex flex-col items-center justify-center gap-6">
      <Link
        to="/room-lobby"
        onClick={() => {
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
          onClick={() => {
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
