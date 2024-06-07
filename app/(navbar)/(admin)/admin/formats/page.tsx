'use server';

import FormatVersions from '@/app/(navbar)/(admin)/admin/formats/FormatVersions';
import Title from '@/components/typography/Title';
import Formats from '@/app/(navbar)/(admin)/admin/formats/Formats';
import ContentWFull from '@/components/layout/ContentWFull';

export default async function AdminFormats() {
  return (
    <ContentWFull>
      <main className="flex flex-col gap-4">
        <Title size="2xl" title="Formats" />
        <Formats />
        <Title size="2xl" title="Format versions" />
        <FormatVersions />
      </main>
    </ContentWFull>
  );
}
