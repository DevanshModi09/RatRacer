import { useState, useEffect } from 'react';

import { socket } from './utils/socket';

type Stats = {
  correctChars: number;

  incorrectChars: number;

  progress: number;

  wpm: number;

  accuracy: number;

  finished: boolean;
};

type OpponentStats = Record<
  string,
  {
    username: string;

    progress: number;

    wpm: number;
  }
>;

const App = () => {
  const [username, setUsername] = useState('');
  const [isRaceFinished, setRaceFinished] = useState(false);
  const [text, setText] = useState('');

  const [isRaceStarted, setRaceStarted] = useState(false);

  const [raceCountDown, setRaceCountdown] = useState<number | null>(null);

  const [typingInput, setTypingInput] = useState('');

  const [startedAt, setStartedAt] = useState<number | null>(null);

  const [roomCode, setRoomCode] = useState('');

  const [room, setRoom] = useState<any>(null);

  const [isReady, setIsReady] = useState(false);

  /*
    PLAYER STATS
  */
  const [stats, setStats] = useState<Stats>({
    correctChars: 0,

    incorrectChars: 0,

    progress: 0,

    wpm: 0,

    accuracy: 0,

    finished: false,
  });

  /*
    OPPONENT STATS
  */
  const [opponentStats, setOpponentStats] = useState<OpponentStats>({});

  /*
    SOCKET EVENTS
  */
  useEffect(() => {
    /*
      OPPONENT PROGRESS
    */
    socket.on('opponent_progress', ({ socketId, username, progress, wpm }) => {
      setOpponentStats((prev) => ({
        ...prev,

        [socketId]: {
          username,

          progress,

          wpm,
        },
      }));
    });

    /*
      START RACE
    */
    socket.on('start-race', ({ text, startTime }) => {
      setText(text);

      const interval = setInterval(() => {
        const remaining = Math.ceil((startTime - Date.now()) / 1000);

        setRaceCountdown(remaining);

        if (remaining <= 0) {
          clearInterval(interval);

          setRaceStarted(true);

          setStartedAt(Date.now());
        }
      }, 100);
    });

    /*
      ROOM CREATED
    */
    socket.on('room_created', (room) => {
      setRoomCode(room.roomCode);

      setRoom(room);
    });

    /*
      ROOM UPDATED
    */
    socket.on('room_updated', (room) => {
      setRoomCode(room.roomCode);

      setRoom(room);
    });

    /*
      CLEANUP
    */
    return () => {
      socket.off('opponent_progress');

      socket.off('start-race');

      socket.off('room_created');

      socket.off('room_updated');
    };
  }, []);

  /*
    CREATE ROOM
  */
  const handleCreateRoom = () => {
    socket.emit('create-room', {
      username,
    });
  };

  /*
    JOIN ROOM
  */
  const handleJoinRoom = () => {
    socket.emit('join-room', {
      roomCode,
      username,
    });
  };

  /*
    READY
  */
  const handleReady = () => {
    setIsReady((prev) => !prev);

    socket.emit('player-ready', roomCode, !isReady);
  };

  /*
    TYPING
  */
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setTypingInput(value);

    let correctChars = 0;

    let incorrectChars = 0;

    for (let i = 0; i < value.length; i++) {
      if (value[i] === text[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }

    const progress = (correctChars / text.length) * 100;

    const elapsedSeconds = startedAt ? (Date.now() - startedAt) / 1000 : 1;

    const wpm = (correctChars / 5) * (60 / elapsedSeconds);

    const accuracy = (correctChars / value.length) * 100 || 0;

    const finished = correctChars === text.length;

    const updatedStats = {
      correctChars,

      incorrectChars,

      progress,

      wpm: Math.round(wpm),

      accuracy: Number(accuracy.toFixed(2)),

      finished,
    };

    setStats(updatedStats);
    if (finished) {
      setRaceFinished(true);
    }
    /*
      REALTIME EMIT
    */
    socket.emit('progress-update', {
      roomCode,

      progress,

      wpm: Math.round(wpm),
    });
  };

  /*
    ROOM UI
  */
  if (room) {
    return (
      <div
        style={{
          padding: '40px',

          fontFamily: 'sans-serif',
        }}
      >
        <h1>Room: {roomCode}</h1>

        {/* PLAYERS */}

        <h2>Players</h2>

        {room.players.map((player: any) => (
          <div key={player.socketId}>
            {player.username}

            {' - '}

            {player.ready ? 'ready' : 'not ready'}
          </div>
        ))}

        {/* READY */}

        {!isRaceStarted && <button onClick={handleReady}>Ready</button>}

        {/* COUNTDOWN */}

        {!isRaceStarted && raceCountDown !== null && (
          <h1>Race starts in: {raceCountDown}</h1>
        )}

        {/* RACE */}

        {isRaceStarted && (
          <div>
            <h2>Typing Race</h2>

            {/* TEXT */}

            <p
              style={{
                fontSize: '22px',

                lineHeight: '40px',
              }}
            >
              {text}
            </p>

            {/* INPUT */}
            {isRaceFinished ? (
              <input
                type="text"
                value={typingInput}
                onChange={handleTyping}
                style={{
                  width: '100%',

                  padding: '12px',

                  fontSize: '18px',
                }}
              />
            ) : (
              <div>Race Already Finished</div>
            )}

            {/* YOUR STATS */}

            <div
              style={{
                marginTop: '20px',
              }}
            >
              <h2>Your Stats</h2>

              <p>Progress: {stats.progress.toFixed(2)}%</p>

              <p>WPM: {stats.wpm}</p>

              <p>Accuracy: {stats.accuracy}%</p>

              {stats.finished && <h2>Race Finished 🎉</h2>}
            </div>

            {/* OPPONENTS */}

            <h2>Opponents</h2>

            {Object.entries(opponentStats).map(([socketId, opponent]) => (
              <div
                key={socketId}
                style={{
                  border: '1px solid gray',

                  padding: '12px',

                  marginTop: '10px',
                }}
              >
                <h3>{opponent.username}</h3>

                <p>Progress: {opponent.progress.toFixed(2)}%</p>

                <p>WPM: {Math.round(opponent.wpm)}</p>

                {/* BAR */}

                <div
                  style={{
                    width: '100%',

                    height: '10px',

                    background: '#ddd',

                    borderRadius: '10px',

                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${opponent.progress}%`,

                      height: '100%',

                      background: 'green',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /*
    HOME SCREEN
  */
  return (
    <div
      style={{
        padding: '40px',

        fontFamily: 'sans-serif',
      }}
    >
      <h1>Rat Racer</h1>

      {/* USERNAME */}

      <div>
        <label>Enter Username</label>

        <br />

        <input
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </div>

      {/* ACTIONS */}

      {username && (
        <div
          style={{
            marginTop: '20px',
          }}
        >
          <button onClick={handleCreateRoom}>Create Room</button>

          <br />
          <br />

          <label>Enter Room Code</label>

          <br />

          <input
            value={roomCode}
            onChange={(e) => {
              setRoomCode(e.target.value);
            }}
          />

          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      )}
    </div>
  );
};

export default App;
