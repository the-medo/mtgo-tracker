import { TagType } from '@prisma/client';
import TagAdmin from '@/components/tags/TagAdmin';

export default function MatchesTags() {
  return <TagAdmin type={TagType.MATCH} />;
}
