import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import {
  Users,
  Gauge,
  Trophy,
  RotateCcw,
  ArrowRight,
  Rat,
} from 'lucide-react';

const DEMO_TEXT = 'race your friends and see who really types the fastest';

const DemoTypingPreview = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const done = input.length >= DEMO_TEXT.length;

  const handleChange = (value: string) => {
    if (value.length > DEMO_TEXT.length) return;
    if (startedAt === null && value.length > 0) setStartedAt(Date.now());
    setInput(value);

    const start = startedAt ?? Date.now();
    const elapsedMinutes = Math.max((Date.now() - start) / 60000, 1 / 60000);
    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === DEMO_TEXT[i]) correct++;
    }
    setWpm(Math.round(correct / 5 / elapsedMinutes));
  };

  const reset = () => {
    setInput('');
    setStartedAt(null);
    setWpm(0);
    inputRef.current?.focus();
  };

  return (
    <div className="card bg-base-200 border border-base-300 shadow-xl w-full max-w-2xl">
      <div className="card-body">
        <div className="flex items-center justify-between text-sm text-base-content/50 mb-2">
          <span>Try it — no account needed</span>
          <span className="font-race font-semibold text-primary">{wpm} wpm</span>
        </div>
        <button
          type="button"
          className="text-left w-full font-race text-xl sm:text-2xl leading-relaxed break-words rounded-xl bg-base-300 p-5 border border-base-content/10 cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {DEMO_TEXT.split('').map((char, index) => {
            let color = 'text-base-content/40';
            if (index < input.length) {
              color = input[index] === char ? 'text-success' : 'text-error';
            }
            if (index === input.length) {
              color = 'bg-primary text-primary-content rounded px-[2px]';
            }
            return (
              <span key={index} className={`${color} transition-colors`}>
                {char}
              </span>
            );
          })}
        </button>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          disabled={done}
          aria-label="Typing demo input"
          placeholder="Start typing here..."
          className="input input-bordered w-full mt-4 font-race"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        {done && (
          <div className="alert alert-success mt-4 flex items-center justify-between">
            <span>Nice! {wpm} WPM. Sign up to race real opponents.</span>
            <button
              type="button"
              className="btn btn-sm btn-ghost gap-1"
              onClick={reset}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const features = [
  {
    icon: Users,
    title: 'Real-time multiplayer',
    description:
      'Create a room, share the code, and race friends live — no lag, no waiting.',
  },
  {
    icon: Gauge,
    title: 'Live WPM & accuracy',
    description:
      'Watch your words-per-minute and accuracy update instantly as you type.',
  },
  {
    icon: Trophy,
    title: 'XP, coins & leaderboard',
    description:
      'Earn rewards for every race and climb the global leaderboard.',
  },
  {
    icon: RotateCcw,
    title: 'Instant rematch',
    description:
      'Loved that race? Hit Race Again and go another round with the same crew.',
  },
];

const steps = [
  {
    title: 'Create or join a room',
    description: 'Spin up a room and send the code to friends, or drop into theirs.',
  },
  {
    title: 'Race in real time',
    description: 'A short countdown syncs everyone, then it is pure typing speed.',
  },
  {
    title: 'Climb the leaderboard',
    description: 'Earn XP and coins, level up, and chase the top spot.',
  },
];

const LandingPage = () => {
  return (
    <div className="px-4">
      {/* HERO */}
      <section className="max-w-6xl mx-auto pt-14 pb-20 flex flex-col items-center text-center gap-8">
        <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Rat className="size-7 text-primary" aria-hidden="true" />
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-3xl">
          Type fast. Race friends. <span className="text-primary">Win.</span>
        </h1>
        <p className="text-lg text-base-content/60 max-w-xl">
          RatRacer is a real-time multiplayer typing race. Create a room, invite
          friends, and see who has the fastest fingers.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/signup" className="btn btn-primary btn-lg gap-2">
            Start racing free
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
          <Link to="/login" className="btn btn-ghost btn-lg">
            I already have an account
          </Link>
        </div>

        <div className="w-full flex justify-center pt-6">
          <DemoTypingPreview />
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-base-200 border border-base-300 rounded-3xl p-6 space-y-3"
            >
              <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Icon className="size-5 text-primary" aria-hidden="true" />
              </div>
              <h2 className="font-bold text-lg">{title}</h2>
              <p className="text-base-content/60 text-sm">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-4xl mx-auto pb-24">
        <h2 className="text-3xl font-bold text-center mb-10">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center space-y-3">
              <div className="mx-auto size-10 rounded-full bg-primary text-primary-content font-bold flex items-center justify-center">
                {index + 1}
              </div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-base-content/60 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Link to="/signup" className="btn btn-primary gap-2">
            Create your first room
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
