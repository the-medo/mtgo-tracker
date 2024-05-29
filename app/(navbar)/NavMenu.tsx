import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/navbar';
import { Link } from '@nextui-org/link';
import Image from 'next/image';
import { UserDropdown } from '@/components/auth/UserDropdown';
import { Bebas_Neue } from 'next/font/google';
import { LOGO_URL } from '@/lib/constants';

const displayFont = Bebas_Neue({
  weight: '400',
});

export default function NavMenu() {
  return (
    <Navbar isBordered maxWidth="full">
      <NavbarBrand>
        <Image src={LOGO_URL} alt="logo" width="50" height="50" />
        <p className={`font-bold text-4xl text-inherit ${displayFont.className}`}>FetchBook</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="#" aria-current="page">
            Latest
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#" aria-current="page">
            Events
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#" aria-current="page">
            Decks
          </Link>
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
