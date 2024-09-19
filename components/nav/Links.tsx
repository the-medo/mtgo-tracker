'use client';

import { Link } from '@nextui-org/link';
import { TbArrowLeft, TbArrowRight, TbBrandDiscord, TbBrandGithub } from 'react-icons/tb';
import { useSession } from 'next-auth/react';

export interface LinksProps {
  variant: 'sm' | 'lg';
}

export default function Links({ variant }: LinksProps) {
  const { status } = useSession();

  if (variant === 'sm') {
    return (
      <div className="flex flex-col grow items-center justify-end gap-2">
        <div className="flex gap-2">
          <Link target="_blank" href={process.env.NEXT_PUBLIC_DISCORD_INVITE_LINK}>
            <TbBrandDiscord />
          </Link>
          <Link target="_blank" href={process.env.NEXT_PUBLIC_GITHUB_REPO_LINK}>
            <TbBrandGithub />
          </Link>
        </div>
        <div className="flex gap-4">
          <Link href="/about">
            <span className="text-xs">About</span>
          </Link>
          <Link href="/privacy-policy">
            <span className="text-xs">Priv. policy</span>
          </Link>
        </div>
        <span className="text-xs">Version: {process.env.NEXT_PUBLIC_VERSION}</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col grow items-center justify-end gap-4">
        <div className="flex flex-col gap-2">
          {status === 'authenticated' ? (
            <Link href="/your/dashboard" className="text-zinc-800 flex gap-2">
              <TbArrowLeft />
              <span className="text-xl">Back to app</span>
            </Link>
          ) : null}
          <span>&nbsp;</span>
          <Link href="/about" className="text-zinc-800 flex gap-2">
            <TbArrowRight />
            <span className="text-xl">About</span>
          </Link>
          <Link href="/privacy-policy" className="text-zinc-800 flex gap-2">
            <TbArrowRight />
            <span className="text-xl">Privacy policy</span>
          </Link>
        </div>
        <div className="flex gap-2">
          <Link target="_blank" href={process.env.NEXT_PUBLIC_DISCORD_INVITE_LINK}>
            <TbBrandDiscord size={24} />
          </Link>
          <Link target="_blank" href={process.env.NEXT_PUBLIC_GITHUB_REPO_LINK}>
            <TbBrandGithub size={24} />
          </Link>
        </div>
        <span className="text-xs">Version: {process.env.NEXT_PUBLIC_VERSION}</span>
      </div>
    </>
  );
}
