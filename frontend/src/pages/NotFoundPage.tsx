import { Link } from 'react-router-dom';
import { Rat, House } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="mx-auto size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Rat className="size-8 text-primary" aria-hidden="true" />
        </div>
        <h1 className="text-5xl font-black font-race text-primary">404</h1>
        <p className="text-base-content/60">
          This page scurried off somewhere. Let&apos;s get you back on track.
        </p>
        <Link to="/" className="btn btn-primary gap-2">
          <House className="size-4" aria-hidden="true" />
          Back home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
