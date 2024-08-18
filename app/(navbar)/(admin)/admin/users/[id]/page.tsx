import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { Avatar } from '@nextui-org/avatar';

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  return {
    title: `Profile - ${user?.name}`,
  };
}

export default async function UserProfile({ params }: Props) {
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  const { name, bio, image } = user ?? {};

  return (
    <div>
      <h1>{name}</h1>
      <Avatar size="lg" src={user?.image ?? undefined} alt="Avatar" />
    </div>
  );
}
