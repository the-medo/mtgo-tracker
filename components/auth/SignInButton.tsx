'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';

export function SignInButton() {
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
    <Button variant="shadow" size="lg" onClick={() => signIn()}>
      Sign In
    </Button>
  );
}
