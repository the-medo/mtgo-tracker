'use client';

import { signIn, useSession } from 'next-auth/react';
import { Button } from '@nextui-org/button';
import { redirect } from 'next/navigation';
import { Spinner } from '@nextui-org/spinner';

interface SignInProvidersProps {
  redirectToDashboard?: boolean;
}

export function SignInProviders({ redirectToDashboard }: SignInProvidersProps) {
  const { status } = useSession();
  if (status === 'loading') return <Spinner />;

  if (status === 'authenticated') {
    if (redirectToDashboard) {
      redirect('/your/dashboard');
    }

    return null;
  }

  return (
    <div className="flex flex-col p-5 gap-5 justify-center items-center">
      <Button
        variant="shadow"
        size="lg"
        className="w-[300px] bg-zinc-400 text-zinc-800"
        onClick={() => signIn('google')}
        startContent={
          // eslint-disable-next-line @next/next/no-img-element
          <img
            height={24}
            width={24}
            src={'https://authjs.dev/img/providers/google.svg'}
            alt="Google logo"
          />
        }
      >
        Continue with Google
      </Button>
      <Button
        variant="shadow"
        size="lg"
        className="w-[300px] bg-zinc-400 text-zinc-800"
        onClick={() => signIn('github')}
        startContent={
          // eslint-disable-next-line @next/next/no-img-element
          <img
            height={24}
            width={24}
            src={'https://authjs.dev/img/providers/github.svg'}
            alt="GitHub logo"
          />
        }
      >
        Continue with GitHub
      </Button>
    </div>
  );
}
