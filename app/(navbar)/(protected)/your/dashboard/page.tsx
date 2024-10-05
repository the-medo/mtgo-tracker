import DashboardEvents from '@/app/(navbar)/(protected)/your/dashboard/DashboardEvents';
import DashboardDecks from '@/app/(navbar)/(protected)/your/dashboard/DashboardDecks';
import DailyMatchCalendar from '@/app/(navbar)/(protected)/your/dashboard/DailyMatchCalendar';
import EventAggregations from '@/app/(navbar)/(protected)/your/dashboard/EventAggregations';

export default async function YourDashboard() {
  return (
    <div className="flex flex-col w-full gap-2 md:gap-4">
      <main className="flex flex-row flex-wrap w-full bg-default-100 gap-2 p-2 md:gap-4 md:p-4">
        <DailyMatchCalendar />
        <EventAggregations />
      </main>
      <main className="flex flex-row gap-2 p-2 md:gap-4 md:p-4 flex-wrap w-full">
        <DashboardEvents />
        <DashboardDecks />
      </main>
    </div>
  );
}
