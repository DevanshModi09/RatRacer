import { Router } from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { prisma } from '../lib/prisma.js';
const router = Router();
router.get('/', authenticateUser, async (req, res) => {
  const leaderboard = await prisma.user.findMany({
    orderBy: {
      bestWpm: 'desc',
    },

    take: 30,
    select: {
      username: true,
      bestWpm: true,
      avgWpm: true,
      totalWins: true,
      totalRaces: true,
      level: true,
    },
  });
  res.status(200).json({
    leaderboard,
  });
});
export default router;
