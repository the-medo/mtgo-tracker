'use client';

import { TagType } from '@prisma/client';
import TagAdmin from '@/components/tags/TagAdmin';
import TagAdminBox from '@/app/(navbar)/(protected)/settings/tags/TagAdminBox';

export default function TagAdministrations() {
  return (
    <>
      <TagAdminBox title="Deck tags">
        <TagAdmin type={TagType.DECK} />
      </TagAdminBox>
      <TagAdminBox title="Event tags">
        <TagAdmin type={TagType.EVENT} />
      </TagAdminBox>
      <TagAdminBox title="Match tags">
        <TagAdmin type={TagType.MATCH} />
      </TagAdminBox>
      <TagAdminBox title="Game tags">
        <TagAdmin type={TagType.GAME} />
      </TagAdminBox>
    </>
  );
}
