import { useRoomStore } from '../../store/useRoomStore';
import { useEffect, useState } from 'react';

const RaceCountdown = () => {
  const { startTime, countdown, setCountdown } = useRoomStore();

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTime = Math.ceil((startTime - Date.now()) / 1000);

      if (remainingTime <= 0) {
        clearInterval(interval);
        setCountdown(0);
      } else {
        setCountdown(remainingTime);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [startTime]);

  if (countdown === 0) return null;

  return (
    <div className="flex justify-center">
      <h1 className="text-8xl font-black text-amber-400">{countdown}</h1>
    </div>
  );
};
export default RaceCountdown;
