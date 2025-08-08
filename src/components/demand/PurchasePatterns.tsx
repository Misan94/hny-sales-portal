import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';
import { PurchasePatternsData } from '@/hooks/useDemandAnalytics';
import { formatNaira } from '@/lib/utils';

interface PurchasePatternsProps {
  data: PurchasePatternsData[];
}

export function PurchasePatterns({ data }: PurchasePatternsProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Purchase Patterns
        </CardTitle>
        <CardDescription>
          Monthly transaction trends and seasonality patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="period" 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'volume') return [value, 'Transactions'];
                  if (name === 'avgOrderValue') return [formatNaira(value), 'Avg Order Value'];
                  if (name === 'frequency') return [value.toFixed(1), 'Purchase Frequency'];
                  return [value, name];
                }}
              />
              <Line 
                type="monotone" 
                dataKey="volume" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="frequency" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}