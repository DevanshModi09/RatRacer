import { useRoomStore } from '../store/useRoomStore';

const RoomLobbyPage = () => {
  const { currentRoom, players, isRaceStarted, isRoomLoading, isReady } =
    useRoomStore();

  if (isRoomLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <div className="flex flex-col items-center gap-2 group">
            <div
              className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
            >
              <span className="text-2xl">🐀</span>
            </div>

            <h1 className="text-4xl font-bold mt-2">Room Lobby</h1>

            <p className="text-base-content/60">Waiting for players to join</p>
          </div>
        </div>

        {/* ROOM CARD */}
        <div className="card bg-base-200 border border-base-300 shadow-xl">
          <div className="card-body space-y-8">
            {/* ROOM CODE */}
            <div className="text-center">
              <p className="text-sm uppercase tracking-widest text-base-content/50">
                Room Code
              </p>

              <h2 className="mt-3 text-5xl font-black tracking-[0.25em] text-primary">
                {currentRoom?.roomCode}
              </h2>
            </div>

            {/* PLAYERS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Players</h3>

                <span className="badge badge-primary badge-outline">
                  {players.length} Joined
                </span>
              </div>

              <div className="space-y-3">
                {players.map((player) => (
                  <div
                    key={player.username}
                    className="flex items-center justify-between p-4 rounded-xl bg-base-300 border border-base-content/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-10">
                          <span>{player.username[0].toUpperCase()}</span>
                        </div>
                      </div>

                      <span className="font-semibold">{player.username}</span>
                    </div>

                    <div className="badge badge-ghost">Waiting</div>
                  </div>
                ))}
              </div>
            </div>

            {/* READY BUTTON */}
            <button
              type="button"
              className={`btn w-full ${
                isReady ? 'btn-success' : 'btn-primary'
              }`}
              onClick={() => {
                setReady();
              }}
            >
              {isReady ? 'Ready ✓' : 'Ready Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomLobbyPage;
