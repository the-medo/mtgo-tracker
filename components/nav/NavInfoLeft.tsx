import { Link } from '@nextui-org/link';
import { TbBrandDiscord, TbBrandGithub } from 'react-icons/tb';
import Image from 'next/image';
import { LOGO_URL } from '@/lib/constants';
import { SignInProviders } from '@/components/auth/SignInProviders';
import Links from '@/components/nav/Links';
import { Bebas_Neue } from 'next/font/google';
import { PropsWithChildren } from 'react';

const displayFont = Bebas_Neue({
  weight: '400',
});

interface NavInfoLeftProps {
  redirectToDashboard?: boolean;
}

export default function NavInfoLeft({ redirectToDashboard }: NavInfoLeftProps) {
  return (
    <>
      <div className="flex flex-col h-full md:w-[400px] w-full p-5 gap-5 items-center bg-opacity-85 bg-zinc-100">
        <Image src={LOGO_URL} alt="logo" width="150" height="150" />
        <div className="flex flex-col justify-center items-center">
          <p className={`font-bold text-8xl text-inherit ${displayFont.className} text-zinc-800`}>
            FetchBook
          </p>
          <p className="text-zinc-700">Manual MTG stat tracker</p>
        </div>
        <SignInProviders redirectToDashboard={redirectToDashboard} />
        <div className="flex flex-col p-5 gap-5 justify-center items-center">
          <Links variant="lg" />
        </div>
      </div>
    </>
  );
}
