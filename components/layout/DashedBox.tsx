import Title from '@/components/typography/Title';
import { PropsWithChildren } from 'react';

interface DashedBoxProps extends PropsWithChildren {
  title: string;
}

export default function DashedBox({ title, children }: DashedBoxProps) {
  return (
    <div className="p-2 md:p-4 w-full rounded-md border-1 border-default-300 border-dashed bg-default-50 flex flex-col items-center justify-center">
      {title ? <Title title={title} /> : null}
      {children}
    </div>
  );
}
