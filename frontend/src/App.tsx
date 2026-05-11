import { useState, useEffect } from 'react';
import { socket } from './utils/socket';

const App = () => {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
//   const [isInsideRoom, setInsideRoom] = useState(false);
  const [room, setRoom] = useState(null);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    socket.on('room_created', (room) => {
      setRoomCode(room.roomCode);
      setRoom(room);
    });
    socket.on('room_updated', (room) => {
      setRoomCode(room.roomCode);
      setRoom(room);
    });
  }, []);
  const handleCreateRoom = () => {
    console.log('handlecreateroomcalled');
    socket.emit('create-room', { username });
  };
  const handleJoinRoom = () => {
    socket.emit('join-room', { roomCode, username });
  };
  const handleReady = () => {
    setIsReady(!isReady);
    socket.emit('player-ready', `${roomCode}`, isReady);
  };
  if (room) {
    return (
      <>
        <h1>RoomCode : {roomCode}</h1>
        {room.players.map((player) => (
          <div>
            {player.username}
            <span> {player.ready ? 'ready' : 'notready'}</span>
          </div>
        ))}
        <button onClick={handleReady}>Ready</button>
      </>
    );
  }
  if (!room) {
    return (
      <>
        <div>
          <label htmlFor="usernameInput">Enter The Username</label>
          <input
            name="usernameInput"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
        </div>

        {username ? (
          <div>
            {' '}
            <button onClick={handleCreateRoom}>CreateRoom</button>
            <br></br>
            <label htmlFor="roomCodeInput">Enter The Roomcode to join</label>
            <input
              name="roomCodeInput"
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value);
              }}
            ></input>
            <button onClick={handleJoinRoom}>JoinRoom</button>
          </div>
        ) : (
          <div>Enter Username To Create Room</div>
        )}
      </>
    );
  }
};
export default App;
