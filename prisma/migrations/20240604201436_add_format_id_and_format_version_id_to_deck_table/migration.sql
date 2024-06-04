/*
  Warnings:

  - Added the required column `formatId` to the `Deck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formatVersionId` to the `Deck` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deck" ADD COLUMN     "formatId" INTEGER NOT NULL,
ADD COLUMN     "formatVersionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_formatId_fkey" FOREIGN KEY ("formatId") REFERENCES "Format"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_formatVersionId_fkey" FOREIGN KEY ("formatVersionId") REFERENCES "FormatVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
