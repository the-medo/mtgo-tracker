export default function ContentWFull({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-full flex flex-col p-4">{children}</div>;
}
