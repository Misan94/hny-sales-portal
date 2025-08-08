import { useDemandAnalytics } from '@/hooks/useDemandAnalytics';
import { DemandVelocity } from '@/components/demand/DemandVelocity';
import { CategoryPerformance } from '@/components/demand/CategoryPerformance';
import { GeographicDemand } from '@/components/demand/GeographicDemand';
import { PackSizeDemand } from '@/components/demand/PackSizeDemand';
import { PurchasePatterns } from '@/components/demand/PurchasePatterns';
import { DemandKPIs } from '@/components/demand/DemandKPIs';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDemandAnalytics() {
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
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Product Demand Analytics</h1>
        <p className="text-muted-foreground text-lg">
          In-depth analysis of product demand patterns for wholesale decision making
        </p>
      </div>

      <DemandKPIs data={demandData} />

      <PurchasePatterns data={demandData.purchasePatterns} />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <DemandVelocity data={demandData.demandVelocity} />
        <CategoryPerformance data={demandData.categoryPerformance} />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <GeographicDemand data={demandData.geographicDemand} />
        <PackSizeDemand data={demandData.packSizeAnalysis} />
      </div>
    </div>
  );
}