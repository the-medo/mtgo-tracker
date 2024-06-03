'use server';

import { Card, CardBody } from '@nextui-org/card';
import FormatVersions from '@/app/(navbar)/(admin)/admin/formats/FormatVersions';
import Title from '@/components/typography/Title';
import Formats from '@/app/(navbar)/(admin)/admin/formats/Formats';

export default async function AdminFormats() {
  return (
    <main className="flex flex-col gap-4">
      <Title size="2xl" title="Formats" />
      <Formats />
      <Title size="2xl" title="Format versions" />
      <FormatVersions />
    </main>
  );
}
