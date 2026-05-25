// LeaderboardPage.tsx

import { useEffect } from 'react';
import { useLeaderboardStore } from '../store/useLeaderboardStore';
import { Trophy, Medal, Crown, Loader2 } from 'lucide-react';
const LeaderboardPage = () => {
  const { leaderboard, fetchLeaderboard, isLeaderboardLoading } =
    useLeaderboardStore();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (isLeaderboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div
              className="size-14 rounded-2xl bg-primary/10 
              flex items-center justify-center"
            >
              <Trophy className="size-7 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl font-bold">Global Leaderboard</h1>

          <p className="text-base-content/60 max-w-2xl mx-auto">
            Top racers competing for the fastest WPM and highest rankings.
          </p>
        </div>

        {/* TABLE CARD */}
        <div
          className="bg-base-200 border border-base-300 
          rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-300">
                <tr>
                  <th className="py-5">Rank</th>
                  <th>Player</th>
                  <th>Best WPM</th>
                  <th>Avg WPM</th>
                  <th>Wins</th>
                  <th>Races</th>
                  <th>Level</th>
                </tr>
              </thead>

              <tbody>
                {leaderboard.map((player, index) => (
                  <tr
                    key={player.username}
                    className="hover:bg-base-300/40 transition-colors"
                  >
                    {/* RANK */}
                    <td className="font-bold">
                      <div className="flex items-center gap-2">
                        {index === 0 ? (
                          <Crown className="size-5 text-yellow-400" />
                        ) : index === 1 ? (
                          <Medal className="size-5 text-gray-400" />
                        ) : index === 2 ? (
                          <Medal className="size-5 text-orange-500" />
                        ) : null}
                        #{index + 1}
                      </div>
                    </td>

                    {/* USERNAME */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          className="size-10 rounded-full bg-primary/10 
                          flex items-center justify-center font-bold text-primary"
                        >
                          {player.username.charAt(0).toUpperCase()}
                        </div>

                        <span className="font-semibold">{player.username}</span>
                      </div>
                    </td>

                    {/* BEST WPM */}
                    <td>
                      <span className="font-bold text-primary">
                        {player.bestWpm}
                      </span>
                    </td>

                    {/* AVG WPM */}
                    <td>{player.avgWpm}</td>

                    {/* WINS */}
                    <td>{player.totalWins}</td>

                    {/* RACES */}
                    <td>{player.totalRaces}</td>

                    {/* LEVEL */}
                    <td>
                      <div className="badge badge-primary badge-outline">
                        Lv. {player.level}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LeaderboardPage;
