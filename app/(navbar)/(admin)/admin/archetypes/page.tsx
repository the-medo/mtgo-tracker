import Title from '@/components/typography/Title';
import ArchetypeGroups from '@/app/(navbar)/(admin)/admin/archetypes/ArchetypeGroups';
import DeckArchetypes from '@/app/(navbar)/(admin)/admin/archetypes/DeckArchetypes';

export default function AdminArchetypes() {
  return (
    <main className="flex flex-col gap-4">
      <Title size="2xl" title="Deck Archetypes" />
      <DeckArchetypes />
      <Title size="2xl" title="Archetype Groups" />
      <ArchetypeGroups />
    </main>
  );
}
