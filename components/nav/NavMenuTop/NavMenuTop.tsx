'use client';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/navbar';
import Image from 'next/image';
import { UserDropdown } from '@/components/auth/UserDropdown';
import { Bebas_Neue } from 'next/font/google';
import { LOGO_URL } from '@/lib/constants';
import NavMenuTopActionButtons from '@/components/nav/NavMenuTop/NavMenuTopActionButtons';
import { TbMenu2, TbMoon, TbSun, TbX } from 'react-icons/tb';
import useStore from '@/store/store';
import { Button } from '@nextui-org/button';
import { LeftMenuType, Theme } from '@/store/appSlice';
import useTheme from '@/lib/hooks/useTheme';

const displayFont = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
});

export default function NavMenuTop() {
  const { theme, toggleTheme } = useTheme();
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
        <NavbarItem className="flex">
          <Button
            isIconOnly
            size="md"
            onClick={toggleTheme}
            radius="full"
            variant="light"
            aria-label="Toggle menu"
          >
            {theme === Theme.LIGHT ? <TbMoon className="w-6 h-6" /> : <TbSun className="w-6 h-6" />}
          </Button>
        </NavbarItem>
        <NavbarItem className="flex md:hidden">
          <Button
            isIconOnly
            size="md"
            onClick={() => toggleIsMenuOpen(LeftMenuType.NAVIGATION)}
            radius="full"
            variant="light"
            aria-label="Toggle menu"
          >
            {isMenuOpen === LeftMenuType.NAVIGATION ? (
              <TbX className="w-6 h-6" />
            ) : (
              <TbMenu2 className="w-6 h-6" />
            )}
          </Button>
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <UserDropdown />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
