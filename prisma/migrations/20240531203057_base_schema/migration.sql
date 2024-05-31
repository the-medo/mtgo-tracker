-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('MATCH', 'GAME', 'EVENT', 'DECK');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('LEAGUE', 'FRIENDLY_LEAGUE', 'CHALLENGE32', 'CHALLENGE64', 'PRELIMINARY', 'TWO_PLAYER_QUEUE', 'OPEN_PLAY', 'RL_SMALL', 'RL_MEDIUM', 'RL_BIG', 'OTHER');

-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('BO1', 'BO3', 'BO5', 'OTHER');

-- CreateEnum
CREATE TYPE "DeckServiceType" AS ENUM ('MOXFIELD', 'GOLDFISH', 'MELEEGG');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mtgoUsername" TEXT,
ADD COLUMN     "mtgoVerificationCode" TEXT,
ADD COLUMN     "mtgoVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Format" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "latestFormatVersionId" INTEGER,

    CONSTRAINT "Format_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormatVersion" (
    "id" SERIAL NOT NULL,
    "latestRelease" TEXT,
    "latestBans" TIMESTAMP(3),
    "description" TEXT,
    "validFrom" TIMESTAMP(3),

    CONSTRAINT "FormatVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchetypeGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ArchetypeGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeckArchetype" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "formatId" INTEGER NOT NULL,
    "archetypeGroupId" INTEGER NOT NULL,

    CONSTRAINT "DeckArchetype_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deck" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "link" TEXT,
    "service" "DeckServiceType",
    "serviceDeckId" TEXT,
    "deckArchetypeId" INTEGER NOT NULL,

    CONSTRAINT "Deck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "mtgoId" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "rounds" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "formatId" INTEGER NOT NULL,
    "formatVersionId" INTEGER NOT NULL,
    "entry" INTEGER,
    "winnings" INTEGER,
    "date" TIMESTAMP(3),

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventUser" (
    "eventId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "EventUser_pkey" PRIMARY KEY ("eventId","userId")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "round" INTEGER,
    "mtgoId" TEXT,
    "userId" TEXT NOT NULL,
    "oppName" TEXT NOT NULL,
    "oppUserId" TEXT,
    "oppMatchId" INTEGER,
    "oppArchetypeId" INTEGER,
    "oppArchetypeNote" TEXT,
    "matchType" "MatchType" NOT NULL,
    "eventId" INTEGER,
    "deckId" INTEGER NOT NULL,
    "isWin" BOOLEAN,
    "startTime" TIMESTAMP(3) NOT NULL,
    "public" BOOLEAN NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "gameNumber" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "mtgoGameId" TEXT,
    "isWin" BOOLEAN,
    "isOnPlay" BOOLEAN,
    "turns" INTEGER,
    "startingHand" INTEGER,
    "oppStartingHand" INTEGER,
    "notes" TEXT,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TagType" NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchTag" (
    "tagId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,

    CONSTRAINT "MatchTag_pkey" PRIMARY KEY ("tagId","matchId")
);

-- CreateTable
CREATE TABLE "GameTag" (
    "tagId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "GameTag_pkey" PRIMARY KEY ("tagId","gameId")
);

-- CreateTable
CREATE TABLE "EventTag" (
    "tagId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "EventTag_pkey" PRIMARY KEY ("tagId","eventId")
);

-- CreateTable
CREATE TABLE "DeckTag" (
    "tagId" INTEGER NOT NULL,
    "deckId" INTEGER NOT NULL,

    CONSTRAINT "DeckTag_pkey" PRIMARY KEY ("tagId","deckId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_gameNumber_matchId_key" ON "Game"("gameNumber", "matchId");

-- AddForeignKey
ALTER TABLE "Format" ADD CONSTRAINT "Format_latestFormatVersionId_fkey" FOREIGN KEY ("latestFormatVersionId") REFERENCES "FormatVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckArchetype" ADD CONSTRAINT "DeckArchetype_archetypeGroupId_fkey" FOREIGN KEY ("archetypeGroupId") REFERENCES "ArchetypeGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckArchetype" ADD CONSTRAINT "DeckArchetype_formatId_fkey" FOREIGN KEY ("formatId") REFERENCES "Format"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_deckArchetypeId_fkey" FOREIGN KEY ("deckArchetypeId") REFERENCES "DeckArchetype"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_formatId_fkey" FOREIGN KEY ("formatId") REFERENCES "Format"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_formatVersionId_fkey" FOREIGN KEY ("formatVersionId") REFERENCES "FormatVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventUser" ADD CONSTRAINT "EventUser_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventUser" ADD CONSTRAINT "EventUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_oppUserId_fkey" FOREIGN KEY ("oppUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_oppMatchId_fkey" FOREIGN KEY ("oppMatchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_oppArchetypeId_fkey" FOREIGN KEY ("oppArchetypeId") REFERENCES "DeckArchetype"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchTag" ADD CONSTRAINT "MatchTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchTag" ADD CONSTRAINT "MatchTag_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameTag" ADD CONSTRAINT "GameTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameTag" ADD CONSTRAINT "GameTag_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTag" ADD CONSTRAINT "EventTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTag" ADD CONSTRAINT "EventTag_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckTag" ADD CONSTRAINT "DeckTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckTag" ADD CONSTRAINT "DeckTag_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
