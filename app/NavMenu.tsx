import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/navbar';
import { Link } from '@nextui-org/link';
import { Button } from '@nextui-org/button';
import Image from 'next/image';
import { Bebas_Neue } from 'next/font/google';

const displayFont = Bebas_Neue({
  weight: '400',
});

export default function NavMenu() {
  return (
    <Navbar isBordered maxWidth="full">
      <NavbarBrand justify="start">
        <Image
          src="https://imagedelivery.net/zchNIWFramhipgMjPiGPQQ/c5be93e3-fbac-4a1a-f103-780cc32fe700/100x100"
          alt="logo"
          width="50"
          height="50"
        />
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
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
