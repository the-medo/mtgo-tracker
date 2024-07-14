/*
  Warnings:

  - You are about to drop the column `isWin` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "isWin",
ADD COLUMN     "result" INTEGER;
