/*
  Warnings:

  - The `result` column on the `Match` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MatchResult" AS ENUM ('WIN', 'LOSE', 'DRAW');

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "result",
ADD COLUMN     "result" "MatchResult";
