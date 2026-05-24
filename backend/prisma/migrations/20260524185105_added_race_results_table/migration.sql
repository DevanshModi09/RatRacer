-- CreateTable
CREATE TABLE "RaceResult" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roomCode" TEXT NOT NULL,
    "wpm" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "position" INTEGER NOT NULL,
    "playersInRoom" INTEGER NOT NULL,
    "xpEarned" INTEGER NOT NULL,
    "coinsEarned" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RaceResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RaceResult" ADD CONSTRAINT "RaceResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
