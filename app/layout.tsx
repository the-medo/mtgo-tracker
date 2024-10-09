import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/app/AuthProvider';
import { Html } from '@/app/html';

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
      <Html>{children}</Html>
    </AuthProvider>
  );
}
