import { Deck } from '@prisma/client';

export async function getDecks() {
  const f = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deck`);
  const jsonData = (await f.json()) as Deck[];

  return jsonData;
}
