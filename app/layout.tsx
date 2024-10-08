import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import AuthProvider from '@/app/AuthProvider';
import useTheme from '@/lib/hooks/useTheme';
import cn from 'classnames';
import { Theme } from '@/store/appSlice';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FetchBook - MTG tracker',
  description: 'Winrates and stuff',
  icons: '/favicon.png',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { theme } = useTheme();
  const theme = Theme.DARK;

  return (
    <AuthProvider>
      <html
        lang="en"
        // className={cn({
        //   light: theme === Theme.LIGHT,
        //   dark: theme === Theme.DARK,
        // })}
      >
        <body
          className={cn(inter.className, {
            light: theme === Theme.LIGHT,
            dark: theme === Theme.DARK,
          })}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </AuthProvider>
  );
}
