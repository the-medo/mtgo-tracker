import Decks from '@/app/(navbar)/(protected)/your/decks/Decks';
import ContentWFull from '@/components/layout/ContentWFull';
import DecksLeftNav from '@/app/(navbar)/(protected)/your/decks/DecksLeftNav';
import Portal from '@/components/app/Portal';

export default function YourDecks() {
  return (
    <div className="w-full flex flex-row">
      <Portal targetId="left-menu-portal-target">
        <DecksLeftNav />
      </Portal>
      <ContentWFull>
        <main className="flex flex-col gap-4">
          <Decks />
        </main>
      </ContentWFull>
    </div>
  );
}
