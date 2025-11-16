import { AppShell } from '@/components/layout/app-shell';
import DailyEnergyWidget from '@/components/dashboard/daily-energy-widget';
import BodyTrendsWidget from '@/components/dashboard/body-trends-widget';
import MicronutrientsWidget from '@/components/dashboard/micronutrients-widget';
import TodaysMealsWidget from '@/components/dashboard/todays-meals-widget';

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 auto-rows-max">
        <div className="lg:col-span-2">
          <DailyEnergyWidget />
        </div>
        <div className="space-y-6">
          <BodyTrendsWidget />
          <TodaysMealsWidget />
        </div>
        <div className="lg:col-span-3">
          <MicronutrientsWidget />
        </div>
      </div>
    </AppShell>
  );
}
