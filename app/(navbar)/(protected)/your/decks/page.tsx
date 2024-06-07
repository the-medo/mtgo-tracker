import Decks from '@/app/(navbar)/(protected)/your/decks/Decks';
import ContentWFull from '@/components/layout/ContentWFull';
import DecksLeftNav from '@/app/(navbar)/(protected)/your/decks/DecksLeftNav';

export default function YourDecks() {
  return (
    <div className="w-full flex flex-row">
      <DecksLeftNav />
      <ContentWFull>
        <main className="flex flex-col gap-4">
          <Decks />
        </main>
      </ContentWFull>
    </div>
  );
}
