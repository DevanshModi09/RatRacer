import { useRoomStore } from '../../store/useRoomStore';
import { useState, useRef, useEffect } from 'react';

type Stats = {
  correctChars: number;
  incorrectChars: number;
  progress: number;
  wpm: number;
  accuracy: number;
  finished: boolean;
};

const RaceArea = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [typingInput, setTypingInput] = useState('');
  const {
    raceText,
    countdown,
    currentRoom,
    setProgressUpdate,
    opponentsStats,
    isRaceFinished,
    setRaceFinished,
    startTime,
  } = useRoomStore();

  const startedAt = startTime;

  const [stats, setStats] = useState<Stats>({
    correctChars: 0,
    incorrectChars: 0,
    progress: 0,
    wpm: 0,
    accuracy: 0,
    finished: false,
  });
  useEffect(() => {
    if (countdown === 0) {
      inputRef.current?.focus();
    }
  }, [countdown]);
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // STRICT WORD CHECK
    const typedWords = value.split(' ');

    const targetWords = raceText.split(' ');

    if (value.endsWith(' ')) {
      const previousTypedWord = typedWords[typedWords.length - 2];

      const previousTargetWord = targetWords[typedWords.length - 2];

      if (previousTypedWord !== previousTargetWord) {
        return;
      }
    }

    setTypingInput(value);

    let correctChars = 0;
    let incorrectChars = 0;

    for (let i = 0; i < value.length; i++) {
      if (value[i] === raceText[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }

    const progress = (correctChars / raceText.length) * 100;

    const elapsedSeconds = startedAt ? (Date.now() - startedAt) / 1000 : 1;

    const wpm = (correctChars / 5) * (60 / elapsedSeconds);

    const accuracy = (correctChars / value.length) * 100 || 0;

    const finished = correctChars === raceText.length;

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

    setProgressUpdate(currentRoom.roomCode, progress, Math.round(wpm));
  };

  const allPlayers = [
    {
      username: 'You',
      progress: stats.progress,
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      isYou: true,
    },

    ...Object.values(opponentsStats).map((opponent: any) => ({
      username: opponent.username,
      progress: opponent.progress,
      wpm: opponent.wpm,
      accuracy: opponent.accuracy || 0,
      isYou: false,
    })),
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      {/* LIVE RACE BARS */}
      <div className="space-y-3">
        {allPlayers.map((player) => (
          <div
            key={player.username}
            className={`rounded-xl px-4 py-3 border transition-all ${
              player.isYou
                ? 'bg-primary/10 border-primary/30'
                : 'bg-base-200 border-base-300'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* NAME */}
              <div className="w-28 flex items-center gap-2">
                <span className="font-bold truncate">{player.username}</span>

                {player.isYou && (
                  <div className="badge badge-primary badge-xs">YOU</div>
                )}
              </div>

              {/* BAR */}
              <div className="flex-1">
                <progress
                  className={`progress w-full h-2 ${
                    player.isYou ? 'progress-primary' : 'progress-secondary'
                  }`}
                  value={player.progress}
                  max="100"
                />
              </div>

              {/* STATS */}
              <div className="flex gap-4 text-sm min-w-fit">
                <span className="font-semibold">
                  {Math.round(player.wpm)} WPM
                </span>

                <span className="text-primary font-bold">
                  {player.progress.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RACE TEXT */}
      <div className="card bg-base-200 border border-base-300 shadow-xl">
        <div className="card-body space-y-5">
          <div>
            <h2 className="text-xl font-bold">Race Text</h2>

            <p className="text-base-content/60 mt-1">
              Type as fast and accurately as possible
            </p>
          </div>

          {/* LIVE TEXT */}
          <div className="bg-base-300 rounded-2xl p-5 border border-base-content/10">
            <p className="text-2xl leading-relaxed break-words">
              {raceText.split('').map((char, index) => {
                let color = 'text-base-content/40';

                if (index < typingInput.length) {
                  color =
                    typingInput[index] === raceText[index]
                      ? 'text-success'
                      : 'text-error';
                }

                if (index === typingInput.length) {
                  color = 'bg-primary text-primary-content rounded px-[2px]';
                }

                return (
                  <span key={index} className={`${color} transition-all`}>
                    {char}
                  </span>
                );
              })}
            </p>
          </div>

          {/* INPUT */}
          {!isRaceFinished ? (
            <input
              type="text"
              disabled={countdown !== 0}
              value={typingInput}
              onChange={handleTyping}
              ref={inputRef}
              placeholder="Start typing..."
              className="input input-bordered input-primary w-full text-lg"
              autoFocus
            />
          ) : (
            <div className="alert alert-success">
              <span>Race Finished 🎉</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RaceArea;
