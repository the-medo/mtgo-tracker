import { parseDate, parseNumber, Stringify } from '@/app/api/parsers';
import { FormatVersion } from '@prisma/client';

export async function getFormatVersions() {
  const f = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/format-version`);
  const jsonData = (await f.json()) as Stringify<FormatVersion>[];

  return jsonData.map(j => ({
    ...j,
    id: parseNumber(j.id),
    validFrom: parseDate(j.validFrom),
  })) as FormatVersion[];
}
