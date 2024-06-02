'use server';

import FormatVersionsClient from '@/app/(navbar)/(admin)/admin/formats/FormatVersionsClient';
import { prisma } from '@/lib/prisma';

export default async function FormatVersions() {
  try {
    // const data = await prisma.formatVersion.findMany();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/format-version`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: undefined,
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();

    return <FormatVersionsClient data={data} />;
  } catch (error) {
    console.error('Failed to fetch format versions:', error);
    return <FormatVersionsClient data={[]} />;
  }
}
