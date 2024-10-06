'use client';

import DeckInfo from '@/app/(navbar)/(protected)/your/decks/[id]/DeckInfo';
import useStore from '@/store/store';
import { LeftMenuType } from '@/store/appSlice';
import FloatingFilterButton from '@/components/app/FloatingFilterButton';
import NavMenuLeftClient from '@/components/nav/NavMenuLeft/NavMenuLeftClient';

interface DeckLeftNavProps {
  deckId: number;
}

export default function DeckLeftNav({ deckId }: DeckLeftNavProps) {
  const toggleIsMenuOpen = useStore(state => state.toggleIsMenuOpen);

  return (
    <>
      <NavMenuLeftClient type={LeftMenuType.SUBMENU}>
        <DeckInfo deckId={deckId} />
      </NavMenuLeftClient>
      <FloatingFilterButton onPress={() => toggleIsMenuOpen(LeftMenuType.SUBMENU)} />
    </>
  );
}
