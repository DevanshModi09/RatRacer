import { useRoomStore } from '../store/useRoomStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const RoomLobbyPage = () => {
  const {
    currentRoom,
    isRaceStarted,
    players,
    isRoomLoading,
    isReady,
    setReady,
    leaveRoom,
  } = useRoomStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (isRaceStarted) {
      navigate('/race');
    }
  }, [isRaceStarted]);

  if (isRoomLoading) {
    return (
      <div className="min-h-[calc(100vh-128px)] flex items-center justify-center">
        <h1 className="text-2xl font-bold text-zinc-100">Room Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-[calc(100vh-128px)] flex items-center justify-center px-4">
        <div className="w-full max-w-xl bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-zinc-100">Room Lobby</h1>

            <p className="mt-2 text-sm uppercase tracking-widest text-zinc-500">
              Room Code
            </p>

            <div className="mt-2 text-3xl font-mono font-bold tracking-[0.3em] text-amber-400">
              {currentRoom?.roomCode}
            </div>
          </div>

          {/* Players */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-200">Players</h2>
            {players.map((player) => (
              <div
                key={player.username}
                className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-800/70 px-4 py-3"
              >
                <span className="text-zinc-100 font-medium">
                  {player.username}
                </span>

                <span className="text-xs text-zinc-400">
                  {player.ready ? 'Ready ✓' : 'Waiting Up'}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              className="btn px-8 bg-amber-500 hover:bg-amber-400 border-none text-black font-semibold"
              onClick={() => {
                setReady(currentRoom.roomCode, isReady);
              }}
            >
              {isReady ? 'Ready ✓' : 'Ready Up'}
            </button>
          </div>
        </div>
      </div>
      <div className="-mt-10 flex items-center justify-center">
        <button
          type="button"
          onClick={() => {
            leaveRoom(currentRoom.roomCode);
            navigate('/');
          }}
          className="btn bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700"
        >
          Leave Room
        </button>
      </div>
    </>
  );
};

export default RoomLobbyPage;
