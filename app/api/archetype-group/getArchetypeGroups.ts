import { parseNumber, Stringify } from '@/app/api/parsers';
import { ArchetypeGroup } from '@prisma/client';

export async function getArchetypeGroups() {
  const f = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/archetype-group`);
  const jsonData = (await f.json()) as Stringify<ArchetypeGroup>[];

  return jsonData.map(j => ({
    ...j,
    id: parseNumber(j.id),
  })) as ArchetypeGroup[];
}
