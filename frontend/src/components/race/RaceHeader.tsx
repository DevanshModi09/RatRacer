import { useRoomStore } from '../../store/useRoomStore';

const RaceHeader = () => {
  const { currentRoom, players } = useRoomStore();

  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">RatRacer</h1>

        <p className="text-zinc-400">Room: {currentRoom?.roomCode}</p>
      </div>

      <div className="text-zinc-300">Players: {players.length}</div>
    </div>
  );
};

export default RaceHeader;
