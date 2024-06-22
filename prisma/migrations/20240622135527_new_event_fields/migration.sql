-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "deckId" INTEGER,
ADD COLUMN     "matchType" "MatchType" NOT NULL DEFAULT 'BO3',
ADD COLUMN     "notes" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE SET NULL ON UPDATE CASCADE;
