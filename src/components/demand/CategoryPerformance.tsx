import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3 } from 'lucide-react';
import { CategoryPerformanceData } from '@/hooks/useDemandAnalytics';
import { formatNaira } from '@/lib/utils';

interface CategoryPerformanceProps {
  data: CategoryPerformanceData[];
}

export function CategoryPerformance({ data }: CategoryPerformanceProps) {
  const maxRevenue = Math.max(...data.map(c => c.revenue));

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Category Performance
        </CardTitle>
        <CardDescription>
          Revenue and market share by product category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {data.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate text-sm">{category.category}</h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{category.volume} transactions</span>
                    <span>{category.marketShare.toFixed(1)}% market share</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-semibold text-sm">{formatNaira(category.revenue)}</div>
                  <div className={`text-xs ${category.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {category.growth > 0 ? '+' : ''}{category.growth.toFixed(1)}%
                  </div>
                </div>
              </div>
              <Progress 
                value={(category.revenue / maxRevenue) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}