import { parseNumber, Stringify } from '@/app/api/parsers';
import { Deck } from '@prisma/client';

export async function getDecks() {
  const f = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deck`);
  const jsonData = (await f.json()) as Stringify<Deck>[];

  return jsonData.map(j => ({
    ...j,
    id: parseNumber(j.id),
    latestFormatVersionId: parseNumber(j.latestFormatVersionId),
  })) as Deck[];
}
