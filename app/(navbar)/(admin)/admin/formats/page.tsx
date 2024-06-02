'use server';

import { Card, CardBody } from '@nextui-org/card';
import FormatVersions from '@/app/(navbar)/(admin)/admin/formats/FormatVersions';
import Title from '@/components/typography/Title';

export default async function AdminFormats() {
  return (
    <main className="flex flex-col gap-4">
      <Title size="2xl" title="Formats" />

      <Title size="2xl" title="Format versions" />
      <FormatVersions />
    </main>
  );
}
