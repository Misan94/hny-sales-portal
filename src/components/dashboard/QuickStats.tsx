
import { Users, ShoppingCart, TrendingUp } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { DashboardMetrics } from '@/hooks/useDashboardData';
import { formatNaira } from '@/lib/utils';

interface QuickStatsProps {
  metrics: DashboardMetrics;
}

export function QuickStats({ metrics }: QuickStatsProps) {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Total Customers"
        value={metrics.totalCustomers.toLocaleString()}
        description={`${metrics.newCustomersThisMonth} new this month`}
        icon={Users}
        trend={{ value: 12, isPositive: true }}
      />
      
      <MetricCard
        title="Total Transactions"
        value={metrics.totalTransactions.toLocaleString()}
        description="All-time transaction count"
        icon={ShoppingCart}
        trend={{ value: 8, isPositive: true }}
      />
      
      <MetricCard
        title="Total Revenue"
        value={formatNaira(metrics.totalRevenue)}
        description="Cumulative revenue"
        icon={TrendingUp}
        trend={{ value: 15, isPositive: true }}
      />
    </div>
  );
}
