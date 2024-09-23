'use client';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/navbar';
import Image from 'next/image';
import { UserDropdown } from '@/components/auth/UserDropdown';
import { Bebas_Neue } from 'next/font/google';
import { LOGO_URL } from '@/lib/constants';
import NavMenuTopActionButtons from '@/components/nav/NavMenuTop/NavMenuTopActionButtons';
import { TbMenu2, TbX } from 'react-icons/tb';
import useStore from '@/store/store';
import { Button } from '@nextui-org/button';

const displayFont = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
});

export default function NavMenuTop() {
  const isMenuOpen = useStore(state => state.isMenuOpen);
  const toggleIsMenuOpen = useStore(state => state.toggleIsMenuOpen);

  return (
    <Navbar isBordered maxWidth="full">
      <NavbarBrand>
        <Image src={LOGO_URL} alt="logo" width="50" height="50" />
        <p className={`font-bold text-4xl text-inherit ${displayFont.className}`}>FetchBook</p>
      </NavbarBrand>
      <NavbarContent className="hidden md:flex gap-4" justify="center">
        <NavMenuTopActionButtons />
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="flex md:hidden">
          <Button
            isIconOnly
            size="md"
            onClick={toggleIsMenuOpen}
            radius="full"
            variant="light"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <TbX className="w-6 h-6" /> : <TbMenu2 className="w-6 h-6" />}
          </Button>
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <UserDropdown />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
