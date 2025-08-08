import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { DemandVelocityData } from '@/hooks/useDemandAnalytics';

interface DemandVelocityProps {
  data: DemandVelocityData[];
}

export function DemandVelocity({ data }: DemandVelocityProps) {
  const getVelocityColor = (velocity: string) => {
    switch (velocity) {
      case 'fast': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'slow': return 'bg-red-500/10 text-red-700 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Demand Velocity
        </CardTitle>
        <CardDescription>
          Product movement speed and trends for inventory optimization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {data.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate text-sm">{product.productName}</h4>
                  <Badge className={getVelocityColor(product.velocity)}>
                    {product.velocity}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{product.volume} transactions</span>
                  <span>{product.revenueContribution.toFixed(1)}% revenue</span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {product.trend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-xs font-medium ${product.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.trend > 0 ? '+' : ''}{product.trend.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}