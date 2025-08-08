import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RFMData } from '@/types/segmentation';
import { TrendingUp, Users, DollarSign, ShoppingCart, Target, AlertTriangle } from 'lucide-react';

interface SegmentAnalyticsProps {
  data: RFMData[];
}

export function SegmentAnalytics({ data }: SegmentAnalyticsProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Segment Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">No data available</div>
        </CardContent>
      </Card>
    );
  }

  const segmentMetrics = calculateSegmentMetrics(data);
  const segmentPerformance = calculateSegmentPerformance(data);

  return (
    <div className="space-y-6">
      {/* Segment Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Segments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{segmentMetrics.totalSegments}</div>
            <p className="text-xs text-muted-foreground">Active customer segments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg CLV</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{segmentMetrics.avgCLV.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Customer lifetime value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{segmentMetrics.retentionRate}%</div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{segmentMetrics.atRiskCount}</div>
            <p className="text-xs text-muted-foreground">Customers need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Segment Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Segment Performance Analysis</CardTitle>
          <CardDescription>Detailed metrics for each customer segment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Segment</th>
                  <th className="text-right p-3 font-medium">Customers</th>
                  <th className="text-right p-3 font-medium">Avg CLV</th>
                  <th className="text-right p-3 font-medium">Avg Recency</th>
                  <th className="text-right p-3 font-medium">Avg Frequency</th>
                  <th className="text-right p-3 font-medium">Revenue Share</th>
                  <th className="text-center p-3 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody>
                {segmentPerformance.map((segment, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: segment.color }}
                        ></div>
                        <span className="font-medium">{segment.segment}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">{segment.customerCount}</td>
                    <td className="p-3 text-right">₦{segment.avgCLV.toLocaleString()}</td>
                    <td className="p-3 text-right">{segment.avgRecency} days</td>
                    <td className="p-3 text-right">{segment.avgFrequency.toFixed(1)}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Progress value={segment.revenueShare} className="w-16 h-2" />
                        <span>{segment.revenueShare.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant={
                        segment.priority === 'High' ? 'destructive' :
                        segment.priority === 'Medium' ? 'default' : 'secondary'
                      }>
                        {segment.priority}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}

function calculateSegmentMetrics(data: RFMData[]) {
  const totalCustomers = data.length;
  const segments = [...new Set(data.map(d => d.segment))];
  const totalRevenue = data.reduce((sum, customer) => sum + customer.monetary, 0);
  const avgCLV = totalRevenue / totalCustomers;
  
  // Calculate retention rate (customers who purchased within last 90 days)
  const activeCustomers = data.filter(customer => customer.recency <= 90).length;
  const retentionRate = Math.round((activeCustomers / totalCustomers) * 100);
  
  // Count at-risk customers
  const atRiskSegments = ['At Risk', 'Cannot Lose Them'];
  const atRiskCount = data.filter(customer => atRiskSegments.includes(customer.segment)).length;

  return {
    totalSegments: segments.length,
    avgCLV: Math.round(avgCLV),
    retentionRate,
    atRiskCount
  };
}



function calculateSegmentPerformance(data: RFMData[]) {
  const segmentGroups = data.reduce((acc, customer) => {
    if (!acc[customer.segment]) {
      acc[customer.segment] = [];
    }
    acc[customer.segment].push(customer);
    return acc;
  }, {} as Record<string, RFMData[]>);

  const totalRevenue = data.reduce((sum, customer) => sum + customer.monetary, 0);
  
  const segmentColors = {
    'Champions': '#10B981',
    'Loyal Customers': '#3B82F6',
    'Potential Loyalists': '#8B5CF6',
    'New Customers': '#06B6D4',
    'At Risk': '#F59E0B',
    'Cannot Lose Them': '#EF4444',
    'Price Sensitive': '#6B7280',
    'Bulk Buyers': '#84CC16',
    'Others': '#9CA3AF'
  };

  return Object.entries(segmentGroups).map(([segment, customers]) => {
    const segmentRevenue = customers.reduce((sum, customer) => sum + customer.monetary, 0);
    const avgCLV = segmentRevenue / customers.length;
    const avgRecency = Math.round(customers.reduce((sum, customer) => sum + customer.recency, 0) / customers.length);
    const avgFrequency = customers.reduce((sum, customer) => sum + customer.frequency, 0) / customers.length;
    const revenueShare = (segmentRevenue / totalRevenue) * 100;

    // Determine priority based on segment characteristics
    let priority = 'Low';
    if (['Champions', 'Loyal Customers', 'Cannot Lose Them'].includes(segment)) {
      priority = 'High';
    } else if (['Potential Loyalists', 'At Risk', 'New Customers'].includes(segment)) {
      priority = 'Medium';
    }

    return {
      segment,
      customerCount: customers.length,
      avgCLV: Math.round(avgCLV),
      avgRecency,
      avgFrequency,
      revenueShare,
      priority,
      color: segmentColors[segment] || '#9CA3AF'
    };
  }).sort((a, b) => b.revenueShare - a.revenueShare);
}
