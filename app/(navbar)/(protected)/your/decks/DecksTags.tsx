import { TagType } from '@prisma/client';
import TagAdmin from '@/components/tags/TagAdmin';

export default function DecksTags() {
  return <TagAdmin type={TagType.DECK} />;
}
