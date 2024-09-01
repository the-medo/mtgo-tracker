import ContentWFull from '@/components/layout/ContentWFull';
import Matches from '@/app/(navbar)/(protected)/your/matches/Matches';
import MatchesLeftNav from '@/app/(navbar)/(protected)/your/matches/MatchesLeftNav';
import Portal from '@/components/app/Portal';

export default function YourMatches() {
  return (
    <div className="w-full flex flex-row">
      <Portal targetId="left-menu-portal-target">
        <MatchesLeftNav />
      </Portal>
      <ContentWFull>
        <main className="flex flex-col gap-4">
          <Matches />
        </main>
      </ContentWFull>
    </div>
  );
}
