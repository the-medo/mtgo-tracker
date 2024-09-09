import DashboardEvents from '@/app/(navbar)/(protected)/your/dashboard/DashboardEvents';
import DashboardDecks from '@/app/(navbar)/(protected)/your/dashboard/DashboardDecks';
import DailyMatchCalendar from '@/app/(navbar)/(protected)/your/dashboard/DailyMatchCalendar';
import EventAggregations from '@/app/(navbar)/(protected)/your/dashboard/EventAggregations';

export default async function YourDashboard() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <main className="flex flex-row gap-4 p-4 flex-wrap w-full bg-default-100">
        <DailyMatchCalendar />
        <EventAggregations />
      </main>
      <main className="flex flex-row gap-4 p-4 flex-wrap w-full">
        <DashboardEvents />
        <DashboardDecks />
      </main>
    </div>
  );
}
