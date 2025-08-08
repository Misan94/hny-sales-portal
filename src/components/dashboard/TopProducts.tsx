
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Package } from 'lucide-react';
import { DashboardMetrics } from '@/hooks/useDashboardData';

interface TopProductsProps {
  metrics: DashboardMetrics;
}

export function TopProducts({ metrics }: TopProductsProps) {
  const maxCount = Math.max(...metrics.topProducts.map(p => p.count));

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-base sm:text-lg">Top Products</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Best performing products by transaction count</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {metrics.topProducts.map((product, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium truncate pr-2 flex-1" title={product.name}>
                  {product.name}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">
                  {product.count} sales
                </span>
              </div>
              <Progress 
                value={(product.count / maxCount) * 100} 
                className="h-1.5 sm:h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
