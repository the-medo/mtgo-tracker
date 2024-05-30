import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/navbar';
import { Link } from '@nextui-org/link';
import Image from 'next/image';
import { UserDropdown } from '@/components/auth/UserDropdown';
import { Bebas_Neue } from 'next/font/google';
import { LOGO_URL } from '@/lib/constants';
import { Button } from '@nextui-org/button';
import { TbPlus } from 'react-icons/tb';

const displayFont = Bebas_Neue({
  weight: '400',
});

const plusIcon = <TbPlus size={18} />;

export default function NavMenuTop() {
  return (
    <Navbar isBordered maxWidth="full">
      <NavbarBrand>
        <Image src={LOGO_URL} alt="logo" width="50" height="50" />
        <p className={`font-bold text-4xl text-inherit ${displayFont.className}`}>FetchBook</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
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
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <UserDropdown />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
