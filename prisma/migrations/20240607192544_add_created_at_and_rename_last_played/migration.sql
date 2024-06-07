/*
  Warnings:

  - You are about to drop the column `lastPlayed` on the `Deck` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deck" DROP COLUMN "lastPlayed",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastPlayedAt" TIMESTAMP(3);
