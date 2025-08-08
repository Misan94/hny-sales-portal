import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';
import { BrandPerformanceData } from '@/hooks/useDemandAnalytics';
import { formatNaira } from '@/lib/utils';

interface BrandPerformanceProps {
  data: BrandPerformanceData[];
}

export function BrandPerformance({ data }: BrandPerformanceProps) {
  const getPositionColor = (position: number) => {
    if (position <= 3) return 'bg-green-500/10 text-green-700 border-green-500/20';
    if (position <= 6) return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
    return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Brand Performance
        </CardTitle>
        <CardDescription>
          Top performing brands by revenue and loyalty
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {data.map((brand, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate text-sm">{brand.brand}</h4>
                  <Badge className={getPositionColor(brand.marketPosition)}>
                    #{brand.marketPosition}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{brand.volume} transactions</span>
                  <span>Loyalty: {brand.loyaltyScore.toFixed(0)}%</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-semibold text-sm">{formatNaira(brand.revenue)}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}