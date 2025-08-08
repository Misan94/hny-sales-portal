import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Package, DollarSign, BarChart3 } from 'lucide-react';
import { DemandAnalyticsData } from '@/hooks/useDemandAnalytics';
import { formatNaira } from '@/lib/utils';

interface DemandKPIsProps {
  data: DemandAnalyticsData;
}

export function DemandKPIs({ data }: DemandKPIsProps) {
  const kpis = [
    {
      title: 'Total Transactions',
      value: data.totalTransactions.toLocaleString(),
      description: 'Transaction volume',
      icon: BarChart3,
      trend: '+12%'
    },
    {
      title: 'Total Revenue',
      value: formatNaira(data.totalRevenue),
      description: 'Revenue generated',
      icon: DollarSign,
      trend: '+8%'
    },
    {
      title: 'Avg Order Value',
      value: formatNaira(data.avgOrderValue),
      description: 'Per transaction',
      icon: TrendingUp,
      trend: '+5%'
    }
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {kpis.map((kpi, index) => (
        <Card key={index} className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{kpi.description}</p>
              <p className="text-xs text-green-600">{kpi.trend}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}