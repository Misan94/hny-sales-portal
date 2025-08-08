import { Users, TrendingUp, Database, ShoppingCart, Package, BarChart3, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { ChurnAnalysisPreview } from '@/components/dashboard/ChurnAnalysisPreview';
import { PurchaseAnalysisPreview } from '@/components/dashboard/PurchaseAnalysisPreview';
import { GrowthMapsPreview } from '@/components/dashboard/GrowthMapsPreview';
import { useDashboardData } from '@/hooks/useDashboardData';
const Home = () => {
  const {
    metrics,
    loading,
    error
  } = useDashboardData();
  const navigate = useNavigate();
  if (loading) {
    return <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Overview</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome to the sales portal
          </p>
        </div>
        
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
      </div>;
  }
  if (error) {
    return <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Overview</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome to the sales portal
          </p>
        </div>
        
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data: {error}
          </AlertDescription>
        </Alert>
      </div>;
  }
  if (!metrics) {
    return null;
  }
  return <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Overview</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Welcome to the sales portal. Here's what's happening across all sections.
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="rounded-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3">Quick Actions</h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" className="flex-1 sm:flex-none" onClick={() => navigate('/predictive-analysis')}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Run Predictive Analysis
          </Button>
          <Button size="lg" variant="outline" className="flex-1 sm:flex-none" onClick={() => navigate('/churn-analysis')}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Run Churn Analysis
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats metrics={metrics} />

      {/* Purchase Analysis Preview */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Purchase Analysis Overview</h3>
        <PurchaseAnalysisPreview metrics={metrics} />
      </div>

      {/* Churn Analysis Preview */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Churn Analysis Overview</h3>
        <ChurnAnalysisPreview metrics={metrics} />
      </div>

      {/* Growth Maps Preview */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Market Growth Opportunities</h3>
        <GrowthMapsPreview metrics={metrics} />
      </div>
    </div>;
};
export default Home;