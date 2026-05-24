// LeaderboardPage.tsx

import { useEffect } from 'react';

import { useLeaderboardStore } from '../store/useLeaderboardStore';

const LeaderboardPage = () => {
  const { leaderboard, fetchLeaderboard, isLeaderboardLoading } =
    useLeaderboardStore();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (isLeaderboardLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Leaderboard</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Best WPM</th>
              <th>Wins</th>
              <th>Races</th>
              <th>Level</th>
            </tr>
          </thead>

          <tbody>
            {leaderboard.map((player, index) => (
              <tr key={player.username}>
                <td>{index + 1}</td>

                <td>{player.username}</td>

                <td>{player.bestWpm}</td>

                <td>{player.totalWins}</td>

                <td>{player.totalRaces}</td>

                <td>{player.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
