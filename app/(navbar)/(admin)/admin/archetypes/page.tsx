import Title from '@/components/typography/Title';
import ArchetypeGroups from '@/app/(navbar)/(admin)/admin/archetypes/ArchetypeGroups';
import DeckArchetypes from '@/app/(navbar)/(admin)/admin/archetypes/DeckArchetypes';
import ContentWFull from '@/components/layout/ContentWFull';

export default function AdminArchetypes() {
  return (
    <ContentWFull>
      <main className="flex flex-col gap-4">
        <Title size="2xl" title="Deck Archetypes" />
        <DeckArchetypes />
        <Title size="2xl" title="Archetype Groups" />
        <ArchetypeGroups />
      </main>
    </ContentWFull>
  );
}
