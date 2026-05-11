import { useState } from 'react';

type Stats = {
  correctChars: number;
  incorrectChars: number;
  progress: number;
  wpm: number;
  accuracy: number;
  finished: boolean;
};

export default function TypingArea() {
  const [raceText] = useState('hello world this is rat racer');
  const [input, setInput] = useState('');
  const [startedAt] = useState(() => Date.now());
  const [stats, setStats] = useState<Stats>({
    correctChars: 0,
    incorrectChars: 0,
    progress: 0,
    wpm: 0,
    accuracy: 0,
    finished: false,
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
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

    const elapsedSeconds = (Date.now() - startedAt) / 1000;

    const wpm = (correctChars / 5) * (60 / elapsedSeconds);

    const accuracy = (correctChars / value.length) * 100 || 0;

    const finished = correctChars === raceText.length;

    setStats({
      correctChars,
      incorrectChars,
      progress,
      wpm: Math.round(wpm),
      accuracy: Number(accuracy.toFixed(2)),
      finished,
    });
  };

  return (
    <div
      style={{
        padding: '40px',
        fontFamily: 'sans-serif',
      }}
    >
      <h1>Rat Racer</h1>
      <p>{raceText}</p>
      {/* typing input */}
      <input
        type="text"
        value={input}
        onChange={handleChange}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '18px',
        }}
      />

      {/* stats */}
      <div style={{ marginTop: '20px' }}>
        <h3>Progress: {stats.progress.toFixed(2)}%</h3>
        <h3>WPM: {stats.wpm}</h3>
        <h3>Accuracy: {stats.accuracy}%</h3>
        {stats.finished && <h2>Race Finished 🎉</h2>}
      </div>
    </div>
  );
}
