import NavMenu from '@/app/(navbar)/NavMenu';

export default async function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavMenu />
      {children}
    </>
  );
}
