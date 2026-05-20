import { Link } from 'react-router-dom';
import { useRoomStore } from '../store/useRoomStore';
import { useAuthStore } from '../store/useAuthStore';
const Homepage = () => {
  const { createRoom } = useRoomStore();
  const { authUser } = useAuthStore();
  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center gap-6">
      <Link
        to="/room-lobby"
        onClick={() => {
          createRoom(authUser);
        }}
        className="btn bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700"
      >
        Create Room
      </Link>

      <button
        type="button"
        className="btn bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700"
      >
        Join Room
      </button>
    </div>
  );
};

export default Homepage;
