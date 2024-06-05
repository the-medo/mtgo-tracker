-- AlterTable
ALTER TABLE "Deck" ADD COLUMN     "lastPlayed" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "UserQOL" (
    "userId" TEXT NOT NULL,
    "lastUsedIds" JSONB,
    "filters" JSONB,

    CONSTRAINT "UserQOL_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "UserQOL" ADD CONSTRAINT "UserQOL_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
