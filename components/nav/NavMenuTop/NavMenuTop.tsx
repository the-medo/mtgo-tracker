import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/navbar';
import Image from 'next/image';
import { UserDropdown } from '@/components/auth/UserDropdown';
import { Bebas_Neue } from 'next/font/google';
import { LOGO_URL } from '@/lib/constants';
import NavMenuTopActionButtons from '@/components/nav/NavMenuTop/NavMenuTopActionButtons';

const displayFont = Bebas_Neue({
  weight: '400',
});

export default async function NavMenuTop() {
  return (
    <Navbar isBordered maxWidth="full">
      <NavbarBrand>
        <Image src={LOGO_URL} alt="logo" width="50" height="50" />
        <p className={`font-bold text-4xl text-inherit ${displayFont.className}`}>FetchBook</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavMenuTopActionButtons />
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <UserDropdown />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
