import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { RFMData } from '@/types/segmentation';
import { TrendingUp, Calendar } from 'lucide-react';

interface BehaviorTrendsProps {
  data: RFMData[];
}

export function BehaviorTrends({ data }: BehaviorTrendsProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Behavior Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">No data available</div>
        </CardContent>
      </Card>
    );
  }

  const recencyTrends = calculateRecencyTrends(data);
  const segmentMigration = calculateSegmentMigration(data);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Purchase Recency Trends
          </CardTitle>
          <CardDescription>
            Distribution of customers by days since last purchase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recencyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${value} customers`, 'Count']}
                />
                <Bar dataKey="count" fill="#3b82f6" name="Customers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Segment Value Analysis
          </CardTitle>
          <CardDescription>
            Average customer value by segment over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={segmentMigration}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="segment" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`₦${value.toLocaleString()}`, 'Avg Value']}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgValue" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Average Value"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function calculateRecencyTrends(data: RFMData[]) {
  const ranges = [
    { range: '0-30 days', min: 0, max: 30 },
    { range: '31-60 days', min: 31, max: 60 },
    { range: '61-90 days', min: 61, max: 90 },
    { range: '91-180 days', min: 91, max: 180 },
    { range: '180+ days', min: 181, max: Infinity }
  ];

  return ranges.map(range => ({
    range: range.range,
    count: data.filter(customer => 
      customer.recency >= range.min && customer.recency <= range.max
    ).length
  }));
}

function calculateSegmentMigration(data: RFMData[]) {
  const segmentGroups = data.reduce((acc, customer) => {
    if (!acc[customer.segment]) {
      acc[customer.segment] = [];
    }
    acc[customer.segment].push(customer);
    return acc;
  }, {} as Record<string, RFMData[]>);

  return Object.entries(segmentGroups)
    .map(([segment, customers]) => ({
      segment: segment.length > 12 ? segment.substring(0, 12) + '...' : segment,
      avgValue: Math.round(customers.reduce((sum, customer) => sum + customer.monetary, 0) / customers.length),
      customerCount: customers.length
    }))
    .sort((a, b) => b.avgValue - a.avgValue)
    .slice(0, 6); // Top 6 segments
}
