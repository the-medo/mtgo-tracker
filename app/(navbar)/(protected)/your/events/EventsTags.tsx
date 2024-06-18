import { TagType } from '@prisma/client';
import TagAdmin from '@/components/tags/TagAdmin';

export default function EventsTags() {
  return <TagAdmin type={TagType.EVENT} />;
}
