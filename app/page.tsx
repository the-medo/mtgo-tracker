import { Bebas_Neue } from 'next/font/google';
import Image from 'next/image';
import { SignInButton } from '@/components/auth/SignInButton';
import { LOGO_URL } from '@/lib/constants';
import { Button } from '@nextui-org/button';

const displayFont = Bebas_Neue({
  weight: '400',
});

export default function Home() {
  return (
    <main className="w-full h-full bg-red-50 bg-cover bg-center opacity-100 bg-[url('https://imagedelivery.net/zchNIWFramhipgMjPiGPQQ/72b180ff-ae0a-4f1e-5225-2de7c6f82700/original')]">
      <div className="flex flex-row">
        <div className="flex flex-row w-full p-5 gap-5 justify-center items-center bg-opacity-15 bg-zinc-50">
          {/*<Image src={LOGO_URL} alt="logo" width="150" height="150" />*/}
          <div className="flex flex-col justify-center items-center">
            <p className={`font-bold text-8xl text-inherit ${displayFont.className} text-zinc-50`}>
              FetchBook
            </p>
            <p className="text-zinc-100">Manual MTG stat tracker</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-10 gap-5 justify-center items-center">
        <SignInButton />
        <p className="text-zinc-50">or</p>
        <Button href="/public">Browse public data</Button>
      </div>
    </main>
  );
}
