import RaceCountdown from '../components/race/RaceCountdown.js';
import RaceHeader from '../components/race/RaceHeader.js';
// import RaceStats from '../components/race/RaceStats.js';
import RaceText from '../components/race/RaceText.js';
// import PlayersProgress from '../components/race/PlayersProgress.js';

const RacePage = () => {
  return (
    <div className="min-h-screen px-10 py-10">
      <RaceHeader />

      <RaceCountdown />

      <div className="mt-12">
        <RaceText />
      </div>

      <div className="mt-12">{/* <PlayersProgress /> */}</div>

      <div className="mt-12">{/* <RaceStats /> */}</div>
    </div>
  );
};

export default RacePage;
