import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';
import { ChurnAnalytics, CustomerChurnData } from '@/types/churn';

interface ChurnTrendsChartProps {
  analytics: ChurnAnalytics;
  customers: CustomerChurnData[];
  isLoading: boolean;
}

export function ChurnTrendsChart({ analytics, customers, isLoading }: ChurnTrendsChartProps) {
  if (isLoading || !analytics || !customers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Churn Trends Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading trends...</div>
        </CardContent>
      </Card>
    );
  }

  // Calculate monthly churn trends
  const monthlyTrends = calculateMonthlyTrends(customers);
  
  // Calculate churn score distribution
  const scoreDistribution = calculateScoreDistribution(customers);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Churn Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Churn Risk Trends</CardTitle>
          <CardDescription>Monthly evolution of customer risk levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="critical" fill="#ef4444" name="Critical" />
                <Bar dataKey="high" fill="#f97316" name="High" />
                <Line type="monotone" dataKey="avgChurnScore" stroke="#8b5cf6" strokeWidth={2} name="Avg Churn Score" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Churn Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Churn Score Distribution</CardTitle>
          <CardDescription>Distribution of churn propensity scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" name="Customers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function calculateMonthlyTrends(customers: CustomerChurnData[]) {
  // Group customers by their last purchase month
  const monthlyData: { [key: string]: { critical: number; high: number; medium: number; low: number; totalScore: number; count: number } } = {};
  
  customers.forEach(customer => {
    const lastPurchaseDate = new Date(customer.lastPurchaseDate);
    const monthKey = `${lastPurchaseDate.getFullYear()}-${String(lastPurchaseDate.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { critical: 0, high: 0, medium: 0, low: 0, totalScore: 0, count: 0 };
    }
    
    monthlyData[monthKey][customer.riskLevel.toLowerCase() as keyof typeof monthlyData[monthKey]]++;
    monthlyData[monthKey].totalScore += customer.churnScore;
    monthlyData[monthKey].count++;
  });

  // Convert to array and calculate averages
  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month: month.slice(5) + '/' + month.slice(2, 4), // Format as MM/YY
      critical: data.critical,
      high: data.high,
      medium: data.medium,
      low: data.low,
      avgChurnScore: Math.round(data.totalScore / data.count)
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6); // Last 6 months
}

function calculateScoreDistribution(customers: CustomerChurnData[]) {
  const ranges = [
    { range: '0-20', min: 0, max: 20 },
    { range: '21-40', min: 21, max: 40 },
    { range: '41-60', min: 41, max: 60 },
    { range: '61-80', min: 61, max: 80 },
    { range: '81-100', min: 81, max: 100 }
  ];

  return ranges.map(range => ({
    range: range.range,
    count: customers.filter(customer => 
      customer.churnScore >= range.min && customer.churnScore <= range.max
    ).length
  }));
}
