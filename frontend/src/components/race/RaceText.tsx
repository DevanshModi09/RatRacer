import { useRoomStore } from '../../store/useRoomStore';

const RaceText = () => {
  const { raceText } = useRoomStore();

  return (
    <div className="max-w-5xl mx-auto text-center">
      <h1 className="text-2xl leading-relaxed text-zinc-100">{raceText}</h1>
    </div>
  );
};

export default RaceText;
