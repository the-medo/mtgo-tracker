import { Bebas_Neue, Inter } from 'next/font/google';

const displayFont = Inter({
  weight: '400',
});

interface Props {
  title: string;
  size?: string;
}

export default function Title({ title, size }: Props) {
  // return <p className={`text-md text-foreground-500`}>{title.toUpperCase()}</p>;
  return (
    <p className={`text-${size ?? 'md'} text-foreground-700 ${displayFont.className}`}>{title}</p>
  );
}
