
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChurnAnalytics } from '@/types/churn';

interface ChurnRiskDistributionProps {
  analytics: ChurnAnalytics | undefined;
  isLoading: boolean;
}

const COLORS = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e'
};

export function ChurnRiskDistribution({ analytics, isLoading }: ChurnRiskDistributionProps) {
  if (isLoading || !analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const data = [
    { name: 'Critical', value: analytics.riskDistribution.critical, color: COLORS.Critical },
    { name: 'High', value: analytics.riskDistribution.high, color: COLORS.High },
    { name: 'Medium', value: analytics.riskDistribution.medium, color: COLORS.Medium },
    { name: 'Low', value: analytics.riskDistribution.low, color: COLORS.Low }
  ].filter(item => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Churn Risk Distribution</CardTitle>
        <CardDescription>
          Visual breakdown of customer risk levels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
