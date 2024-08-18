'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';

export function SignInProviders() {
  const { status } = useSession();
  if (status === 'loading') return <>...</>;

  if (status === 'authenticated') {
    return (
      <>
        <Link href="/your/dashboard">
          <Button variant="shadow" size="lg">
            Browse your stats
          </Button>
        </Link>
        <Button onClick={() => signOut()}>Logout</Button>
      </>
    );
  }

  return (
    <>
      <h1>Sign In</h1>
      <Button
        variant="shadow"
        size="lg"
        className="w-[300px] bg-gradient-to-tr from-zinc-700 to-zinc-900 text-white"
        onClick={() => signIn('github')}
      >
        GitHub
      </Button>
    </>
  );
}
