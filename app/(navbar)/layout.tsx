import NavMenuTop from '@/components/nav/NavMenuTop';
import NavMenuLeft from '@/components/nav/NavMenuLeft';

export default async function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-full">
      <NavMenuTop />
      <div className="flex flex-row gap-5 grow">
        <NavMenuLeft />
        {children}
      </div>
    </div>
  );
}
