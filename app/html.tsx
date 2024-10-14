'use client';

import cn from 'classnames';
import { Theme } from '@/store/appSlice';
import { Providers } from '@/app/providers';
import useTheme from '@/lib/hooks/useTheme';
import { Inter } from 'next/font/google';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FetchBook - MTG tracker',
  description: 'Winrates and stuff',
  icons: '/favicon.png',
};

export function Html({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <html
      lang="en"
      className={cn({
        light: theme === Theme.LIGHT,
        dark: theme === Theme.DARK,
      })}
    >
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href={metadata.icons} />
      </Head>
      <body className={cn(inter.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
