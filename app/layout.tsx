import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import AuthProvider from '@/app/AuthProvider';

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
  return (
    <AuthProvider>
      <html lang="en" className="light">
        <body className={inter.className}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </AuthProvider>
  );
}
