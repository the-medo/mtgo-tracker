import Title from '@/components/typography/Title';
import Decks from '@/app/(navbar)/(protected)/your/decks/Decks';

export default function YourDecks() {
  return (
    <main className="flex flex-col gap-4">
      <Title size="2xl" title="Your decks" />
      <Decks />
    </main>
  );
}
