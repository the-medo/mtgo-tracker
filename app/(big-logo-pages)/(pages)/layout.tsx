import MainPageLayout from '@/components/layout/MainPageLayout';

export default function BigLogoPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainPageLayout>{children}</MainPageLayout>;
}
