import { PropsWithChildren } from 'react';

interface InfoPageProps extends PropsWithChildren {}

export default function InfoPage({ children }: InfoPageProps) {
  return (
    <div className="flex grow bg-zinc-50 bg-opacity-95 p-4 overflow-y-auto">
      <div className="flex flex-col gap-4 max-w-[800px]">{children}</div>
    </div>
  );
}
