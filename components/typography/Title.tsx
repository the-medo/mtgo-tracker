import { Inter } from 'next/font/google';

const displayFont = Inter({
  weight: '400',
  subsets: ['latin'],
});

interface Props {
  title: string;
  size?: string;
}

export default function Title({ title, size }: Props) {
  return (
    <p className={`text-${size ?? 'md'} text-foreground-700 ${displayFont.className}`}>{title}</p>
  );
}
