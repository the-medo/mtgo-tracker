import { Bebas_Neue } from 'next/font/google';
import Image from 'next/image';
import { SignInProviders } from '@/components/auth/SignInProviders';
import { LOGO_URL } from '@/lib/constants';

const displayFont = Bebas_Neue({
  weight: '400',
});

export default function Home() {
  return (
    <>
      <main className="w-full h-full bg-red-50 bg-cover bg-center opacity-100 bg-[url('https://imagedelivery.net/zchNIWFramhipgMjPiGPQQ/72b180ff-ae0a-4f1e-5225-2de7c6f82700/original')]">
        <div className="flex flex-col h-full md:w-[400px] w-full p-5 gap-5 items-center bg-opacity-85 bg-zinc-100">
          <Image src={LOGO_URL} alt="logo" width="150" height="150" />
          <div className="flex flex-col justify-center items-center">
            <p className={`font-bold text-8xl text-inherit ${displayFont.className} text-zinc-800`}>
              FetchBook
            </p>
            <p className="text-zinc-700">Manual MTG stat tracker</p>
          </div>
          <div className="flex flex-col p-10 gap-5 justify-center items-center">
            <SignInProviders />
          </div>
        </div>
      </main>
      <main className="w-full bg-zinc-200 p-4">
        <p className="text-sm">
          Wizards of the Coast, Magic: The Gathering, and their logos are trademarks of Wizards of
          the Coast LLC in the United States and other countries. © 1993-2024 Wizards. All Rights
          Reserved.
        </p>
      </main>
    </>
  );
}
