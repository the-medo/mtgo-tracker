import { parseNumber, Stringify } from '@/app/api/parsers';
import { DeckArchetype } from '@prisma/client';

export async function getDeckArchetypes() {
  console.log('fetching...');
  const f = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deck-archetype`);
  console.log('f', f);

  const jsonData = (await f.json()) as Stringify<DeckArchetype>[];
  console.log('jsonData', jsonData);

  return jsonData.map(j => ({
    ...j,
    id: parseNumber(j.id),
    formatId: parseNumber(j.formatId),
    archetypeGroupId: parseNumber(j.archetypeGroupId),
  })) as DeckArchetype[];
}
