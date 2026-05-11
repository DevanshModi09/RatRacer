import { useState, useRef, type ReactEventHandler, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { socket } from './utils/socket';

const App = () => {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isReady, setIsReady] = useState('');
  useEffect(() => {
    // socket.on();
  }, []);
  const handleCreateRoom = () => {};
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
        </div>
      ) : (
        <div>Enter Username To Create Room</div>
      )}
    </>
  );
};
export default App;
