import { getServerSession } from 'next-auth/next';
import { prismaAdapter } from '@/lib/prisma';
import { NavbarItem } from '@nextui-org/navbar';
import { Button } from '@nextui-org/button';
import { TbPlus } from 'react-icons/tb';

const plusIcon = <TbPlus size={18} />;

export default async function NavMenuTopActionButtons() {
  const session = await getServerSession(prismaAdapter);

  if (!session) {
    return null;
  }

  return (
    <>
      <NavbarItem>
        <Button startContent={plusIcon} className="text-default-700">
          match
        </Button>
      </NavbarItem>
      <NavbarItem>
        <Button startContent={plusIcon} className="text-default-700">
          event
        </Button>
      </NavbarItem>
      <NavbarItem>
        <Button startContent={plusIcon} className="text-default-700">
          deck
        </Button>
      </NavbarItem>
    </>
  );
}
