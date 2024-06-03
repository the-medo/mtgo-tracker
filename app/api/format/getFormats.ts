import { parseNumber, Stringify } from '@/app/api/parsers';
import { Format } from '@prisma/client';

export async function getFormats() {
  const f = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/format`);
  const jsonData = (await f.json()) as Stringify<Format>[];

  return jsonData.map(j => ({
    ...j,
    id: parseNumber(j.id),
    latestFormatVersionId: parseNumber(j.latestFormatVersionId),
  })) as Format[];
}
