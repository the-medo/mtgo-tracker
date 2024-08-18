'use client';

import { signIn, useSession } from 'next-auth/react';
import { Button } from '@nextui-org/button';
import { redirect } from 'next/navigation';

export function SignInProviders() {
  const { status } = useSession();
  if (status === 'loading') return <>...</>;

  if (status === 'authenticated') {
    redirect('/your/dashboard');
  }

  return (
    <>
      <Button
        variant="shadow"
        size="lg"
        className="w-[300px] bg-zinc-400 text-zinc-800"
        onClick={() => signIn('google')}
        startContent={
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
    </>
  );
}
