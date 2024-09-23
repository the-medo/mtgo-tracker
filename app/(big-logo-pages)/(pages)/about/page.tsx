import { Bebas_Neue } from 'next/font/google';

const displayFont = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
});

export default function About() {
  return (
    <>
      <p className={`font-bold text-4xl text-inherit ${displayFont.className} text-zinc-800`}>
        About
      </p>
      <p>
        FetchBook is a simple tool for tracking your MtG stats, designed primarily for MTGO and
        in-person play. With FetchBook, you can keep track of your decks, matches and events, but it
        is not anything special - your excel spreadsheet can be better already. It is also open
        source - all code is public, and if you have the skills, you can improve it!
      </p>
      <p>
        Create and manage decks, events, and matches with ease. Track performance, filter stats, and
        visualize your MTG activity over time. FetchBook is ad-free, and we only use cookies to keep
        you logged in — no data collection, just a clean and streamlined experience for dedicated
        players.
      </p>
    </>
  );
}
