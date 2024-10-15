'use client';

import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import useBreakpoint from '@/lib/hooks/useBreakpoint';
import { useRouter } from 'next/navigation';

export const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useBreakpoint();

  return (
    <NextUIProvider navigate={router.push}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/*<ReactQueryDevtools initialIsOpen={false} />*/}
      </QueryClientProvider>
    </NextUIProvider>
  );
}
