'use client';

import './globals.css';
import AuthProvider from '@/app/AuthProvider';
import { Html } from '@/app/html';

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
