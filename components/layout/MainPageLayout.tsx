import NavInfoLeft from '@/components/nav/NavInfoLeft';
import { PropsWithChildren } from 'react';
import InfoPage from '@/components/nav/InfoPage';

interface MainPageLayoutProps extends PropsWithChildren {
  redirectToDashboard?: boolean;
}

export default function MainPageLayout({ children, redirectToDashboard }: MainPageLayoutProps) {
  return (
    <>
      <main className="flex md:flex-row flex-col w-full md:h-full bg-red-50 bg-cover bg-center opacity-100 bg-[url('https://imagedelivery.net/zchNIWFramhipgMjPiGPQQ/72b180ff-ae0a-4f1e-5225-2de7c6f82700/original')]">
        <NavInfoLeft redirectToDashboard={redirectToDashboard} />
        {children ? <InfoPage>{children}</InfoPage> : null}
      </main>
      <main className="w-full bg-zinc-200 p-4">
        <p className="text-sm">
          Wizards of the Coast, Magic: The Gathering, and their logos are trademarks of Wizards of
          the Coast LLC. © 1995-2024 Wizards. All rights reserved. FetchBook is not affiliated with
          Wizards of the Coast LLC.
        </p>
      </main>
    </>
  );
}
