-- DropForeignKey
ALTER TABLE "Deck" DROP CONSTRAINT "Deck_deckArchetypeId_fkey";

-- DropForeignKey
ALTER TABLE "Deck" DROP CONSTRAINT "Deck_formatId_fkey";

-- DropForeignKey
ALTER TABLE "Deck" DROP CONSTRAINT "Deck_formatVersionId_fkey";

-- DropForeignKey
ALTER TABLE "DeckArchetype" DROP CONSTRAINT "DeckArchetype_archetypeGroupId_fkey";

-- DropForeignKey
ALTER TABLE "DeckArchetype" DROP CONSTRAINT "DeckArchetype_formatId_fkey";

-- DropForeignKey
ALTER TABLE "DeckTag" DROP CONSTRAINT "DeckTag_deckId_fkey";

-- DropForeignKey
ALTER TABLE "DeckTag" DROP CONSTRAINT "DeckTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_formatId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_formatVersionId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";

-- DropForeignKey
ALTER TABLE "EventTag" DROP CONSTRAINT "EventTag_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventTag" DROP CONSTRAINT "EventTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_matchId_fkey";

-- DropForeignKey
ALTER TABLE "GameTag" DROP CONSTRAINT "GameTag_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GameTag" DROP CONSTRAINT "GameTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_deckId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_userId_fkey";

-- DropForeignKey
ALTER TABLE "MatchTag" DROP CONSTRAINT "MatchTag_matchId_fkey";

-- DropForeignKey
ALTER TABLE "MatchTag" DROP CONSTRAINT "MatchTag_tagId_fkey";

-- AddForeignKey
ALTER TABLE "DeckArchetype" ADD CONSTRAINT "DeckArchetype_archetypeGroupId_fkey" FOREIGN KEY ("archetypeGroupId") REFERENCES "ArchetypeGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckArchetype" ADD CONSTRAINT "DeckArchetype_formatId_fkey" FOREIGN KEY ("formatId") REFERENCES "Format"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_formatId_fkey" FOREIGN KEY ("formatId") REFERENCES "Format"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_formatVersionId_fkey" FOREIGN KEY ("formatVersionId") REFERENCES "FormatVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_deckArchetypeId_fkey" FOREIGN KEY ("deckArchetypeId") REFERENCES "DeckArchetype"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_formatId_fkey" FOREIGN KEY ("formatId") REFERENCES "Format"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_formatVersionId_fkey" FOREIGN KEY ("formatVersionId") REFERENCES "FormatVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchTag" ADD CONSTRAINT "MatchTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchTag" ADD CONSTRAINT "MatchTag_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameTag" ADD CONSTRAINT "GameTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameTag" ADD CONSTRAINT "GameTag_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTag" ADD CONSTRAINT "EventTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTag" ADD CONSTRAINT "EventTag_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckTag" ADD CONSTRAINT "DeckTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckTag" ADD CONSTRAINT "DeckTag_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
