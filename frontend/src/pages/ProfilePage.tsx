import { Trophy, Coins, Zap, Target, Crown } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const ProfilePage = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <div
          className="bg-base-200 border border-base-300 
          rounded-3xl shadow-xl p-8"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* AVATAR */}
            <div
              className="size-32 rounded-full bg-primary/10 
              border-4 border-primary/20 flex items-center justify-center"
            >
              <span className="text-5xl font-bold text-primary">
                {authUser.username.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* USER INFO */}
            <div className="space-y-3 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <h1 className="text-4xl font-bold">{authUser.username}</h1>

                <div className="badge badge-primary badge-lg">
                  Level {authUser.level}
                </div>
              </div>

              <p className="text-base-content/60">{authUser.email}</p>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="badge badge-outline badge-primary">
                  {authUser.role}
                </div>

                <div className="badge badge-outline badge-success">
                  {authUser.isVerified ? 'Verified' : 'Unverified'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* BEST WPM */}
          <div
            className="bg-base-200 border border-base-300 
            rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/60">Best WPM</p>

                <h2 className="text-4xl font-bold mt-2">{authUser.bestWpm}</h2>
              </div>

              <Zap className="size-10 text-primary" />
            </div>
          </div>

          {/* AVG WPM */}
          <div
            className="bg-base-200 border border-base-300 
            rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/60">Average WPM</p>

                <h2 className="text-4xl font-bold mt-2">{authUser.avgWpm}</h2>
              </div>

              <Target className="size-10 text-primary" />
            </div>
          </div>

          {/* XP */}
          <div
            className="bg-base-200 border border-base-300 
            rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/60">XP</p>

                <h2 className="text-4xl font-bold mt-2">{authUser.xp}</h2>
              </div>

              <Crown className="size-10 text-primary" />
            </div>
          </div>

          {/* COINS */}
          <div
            className="bg-base-200 border border-base-300 
            rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/60">Coins</p>

                <h2 className="text-4xl font-bold mt-2">{authUser.coins}</h2>
              </div>

              <Coins className="size-10 text-primary" />
            </div>
          </div>

          {/* TOTAL RACES */}
          <div
            className="bg-base-200 border border-base-300 
            rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/60">Total Races</p>

                <h2 className="text-4xl font-bold mt-2">
                  {authUser.totalRaces}
                </h2>
              </div>

              <Trophy className="size-10 text-primary" />
            </div>
          </div>

          {/* TOTAL WINS */}
          <div
            className="bg-base-200 border border-base-300 
            rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/60">Total Wins</p>

                <h2 className="text-4xl font-bold mt-2">
                  {authUser.totalWins}
                </h2>
              </div>

              <Trophy className="size-10 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
