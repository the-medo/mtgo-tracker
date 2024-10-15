'use client';

import cn from 'classnames';
import { Theme } from '@/store/appSlice';
import { Providers } from '@/app/providers';
import useTheme from '@/lib/hooks/useTheme';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={cn(inter.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
