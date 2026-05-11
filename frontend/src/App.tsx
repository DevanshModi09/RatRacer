import { useState, useRef } from 'react';
import { connectWs } from './utils/connectWs.ts';
import TypingArea from './components/TypingArea.tsx';
const App = () => {
  const [hasJoined, setHasJoined] = useState(false);
  const [msg, setMsg] = useState('');
  const [name, setName] = useState('');
  const socket = useRef(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  //! Event handlers
  const handleNameInput = (e) => {
    setName(e.target.value);
  };
  const handlechatInput = (e) => {
    setMsg(e.target.value);
  };
  const handleJoinRoom = () => {
    socket.current = connectWs();
    const ws = socket.current;
    setHasJoined(true);
    ws.on('connect', () => {
      ws.emit('user-connected', name);
    });
    ws.on('user-joined', (message) => {
      setMessages((prev) => [...prev, message]);
    });
    ws.on('user-left', (message) => {
      setMessages((prev) => [...prev, message]);
    });
    ws.on('showmsg', (msg) => {
      setChats((prev) => [...prev, msg]);
    });
  };
  const handleLeaveRoom = () => {
    socket.current.disconnect();
    setHasJoined(false);
  };
  return (
    <>
      🐀🐀🐀🐀🐀🐀🐀🐀🐀🐀🐀🐀
      {!hasJoined ? (
        <div>
          <input
            name="nameInput"
            value={name}
            placeholder="Enter Your Name"
            onChange={handleNameInput}
          ></input>
          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      ) : (
        <div>
          <h1>You are guest logged in as {name}</h1>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
          <button onClick={handleLeaveRoom}>Leave Room</button>
          <div>
            <h1>Chats</h1>
            <div>
              {chats.map((msg, index) => (
                <div key={index}>{msg}</div>
              ))}
            </div>
            <input name="msg" value={msg} onChange={handlechatInput}></input>
            <button
              onClick={() => {
                socket.current.emit('msg-receive', msg);
                setMsg('');
              }}
            >
              Send Msg
            </button>
            <TypingArea></TypingArea>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
