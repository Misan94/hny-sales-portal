import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Package2 } from 'lucide-react';
import { PackSizeAnalysisData } from '@/hooks/useDemandAnalytics';
import { formatNaira } from '@/lib/utils';

interface PackSizeDemandProps {
  data: PackSizeAnalysisData[];
}

export function PackSizeDemand({ data }: PackSizeDemandProps) {
  const maxVolume = Math.max(...data.map(p => p.volume));

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package2 className="h-5 w-5 text-primary" />
          Pack Size Analysis
        </CardTitle>
        <CardDescription>
          Popular pack sizes and profitability by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {data.map((pack, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{pack.packSize}g - {pack.category}</h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{pack.volume} transactions</span>
                    <span>{pack.preference.toFixed(1)}% preference</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-semibold text-sm">{formatNaira(pack.profitability)}</div>
                  <div className="text-xs text-muted-foreground">per unit</div>
                </div>
              </div>
              <Progress 
                value={(pack.volume / maxVolume) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}