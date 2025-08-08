import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { useDemandAnalytics } from '@/hooks/useDemandAnalytics';
import { AgeGenderScatterPlot } from '@/components/demand/AgeGenderScatterPlot';
import { CategoryPerformance } from '@/components/demand/CategoryPerformance';
import { GeographicDemand } from '@/components/demand/GeographicDemand';
import { PackSizeDemand } from '@/components/demand/PackSizeDemand';
import { PurchasePatterns } from '@/components/demand/PurchasePatterns';
import { DemandKPIs } from '@/components/demand/DemandKPIs';
import { Skeleton } from '@/components/ui/skeleton';
import { DateRangePicker } from '@/components/ui/date-range-picker';

export default function ProductDemandAnalytics() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const { data: demandData, loading, error } = useDemandAnalytics();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">
          Error loading demand analytics: {error}
        </div>
      </div>
    );
  }

  if (!demandData) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Purchase Analysis</h1>
          <p className="text-muted-foreground text-lg">
            Customer purchase analysis based on buying patterns
          </p>
        </div>
        <DateRangePicker
          date={dateRange}
          onDateChange={setDateRange}
          placeholder="Select analysis period"
        />
      </div>

      <DemandKPIs data={demandData} />

      <PurchasePatterns data={demandData.purchasePatterns} />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <PackSizeDemand data={demandData.packSizeAnalysis} />
        <CategoryPerformance data={demandData.categoryPerformance} />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <GeographicDemand data={demandData.geographicDemand} />
        <AgeGenderScatterPlot data={demandData} />
      </div>
    </div>
  );
}