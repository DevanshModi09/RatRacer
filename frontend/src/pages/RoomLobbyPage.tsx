import { useRoomStore } from '../store/useRoomStore';

const RoomLobbyPage = () => {
  const { currentRoom, players, isRaceStarted, isRoomLoading, isReady } =
    useRoomStore();

  if (isRoomLoading) {
    return (
      <>
        <h1>Room Loading</h1>
      </>
    );
  }
  console.log(players);
  return (
    <>
      <h1>
        Room code : <div>{currentRoom?.roomCode}</div>
      </h1>
      <h1>Player currently in room </h1>
      {players.map((player) => {
        return <div>{player.username}</div>;
      })}
    </>
  );
};

export default RoomLobbyPage;
