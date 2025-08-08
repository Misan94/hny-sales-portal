import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp, TrendingDown } from 'lucide-react';
import { GeographicDemandData } from '@/hooks/useDemandAnalytics';

interface GeographicDemandProps {
  data: GeographicDemandData[];
}

export function GeographicDemand({ data }: GeographicDemandProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Geographic Demand
        </CardTitle>
        <CardDescription>
          Product demand by location and regional trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {data.map((location, index) => (
            <div key={index} className="p-3 rounded-lg border bg-card/50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{location.location}</h4>
                <div className="flex items-center gap-1">
                  {location.growthRate > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-xs font-medium ${location.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {location.growthRate > 0 ? '+' : ''}{location.growthRate.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{location.volume} transactions</span>
              </div>
              {location.topProducts.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-muted-foreground mb-1">Top products:</div>
                  <div className="flex flex-wrap gap-1">
                    {location.topProducts.map((product, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}