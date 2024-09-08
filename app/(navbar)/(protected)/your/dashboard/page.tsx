import DashboardEvents from '@/app/(navbar)/(protected)/your/dashboard/DashboardEvents';
import DashboardDecks from '@/app/(navbar)/(protected)/your/dashboard/DashboardDecks';

export default async function YourDashboard() {
  return (
    <main className="flex flex-row gap-4 p-4 flex-wrap w-full">
      <DashboardEvents />
      <DashboardDecks />
    </main>
  );
}
