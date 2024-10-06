'use client';

import EventInfo from '@/app/(navbar)/(protected)/your/events/[id]/EventInfo';
import useStore from '@/store/store';
import { LeftMenuType } from '@/store/appSlice';
import NavMenuLeftClient from '@/components/nav/NavMenuLeft/NavMenuLeftClient';
import FloatingFilterButton from '@/components/app/FloatingFilterButton';

interface EventLeftNavProps {
  eventId: number;
}

export default function EventLeftNav({ eventId }: EventLeftNavProps) {
  const toggleIsMenuOpen = useStore(state => state.toggleIsMenuOpen);

  return (
    <>
      <NavMenuLeftClient type={LeftMenuType.SUBMENU}>
        <EventInfo eventId={eventId} />
      </NavMenuLeftClient>
      <FloatingFilterButton onPress={() => toggleIsMenuOpen(LeftMenuType.SUBMENU)} />
    </>
  );
}
