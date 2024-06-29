import ContentWFull from '@/components/layout/ContentWFull';
import DeckLeftNav from '@/app/(navbar)/(protected)/your/decks/[id]/DeckLeftNav';
import DeckContent from '@/app/(navbar)/(protected)/your/decks/[id]/DeckContent';

export default function DeckPage({ params }: { params: { id: number } }) {
  return (
    <div className="w-full flex flex-row">
      <DeckLeftNav deckId={params.id} />
      <ContentWFull>
        <main className="flex flex-col gap-4">
          <DeckContent deckId={params.id} />
        </main>
      </ContentWFull>
    </div>
  );
}
