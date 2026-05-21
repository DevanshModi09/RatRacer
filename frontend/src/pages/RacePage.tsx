import RaceCountdown from '../components/race/RaceCountdown.js';
import RaceArea from '../components/race/RaceArea.js';

const RacePage = () => {
  return (
    <div className="min-h-screen px-10 py-10">
      <RaceCountdown />
      <div className="mt-12">
        <RaceArea />
      </div>
      <div className="mt-12"></div>
    </div>
  );
};

export default RacePage;
