'use server';

import FormatVersionsClient from '@/app/(navbar)/(admin)/admin/formats/FormatVersionsClient';
import { prisma } from '@/lib/prisma';

export default async function FormatVersions() {
  try {
    const data = await prisma.formatVersion.findMany();

    return <FormatVersionsClient data={data} />;
  } catch (error) {
    console.error('Failed to fetch format versions:', error);
    return <FormatVersionsClient data={[]} />;
  }
}
