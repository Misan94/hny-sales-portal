import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingDown, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ChurnAnalysisPreviewProps {
  metrics: any;
}

export function ChurnAnalysisPreview({ metrics }: ChurnAnalysisPreviewProps) {
  const navigate = useNavigate();

  // Mock churn data for demonstration
  const churnRiskData = [
    { risk: 'Critical', count: 23, percentage: 8.5, color: '#ef4444' },
    { risk: 'High', count: 45, percentage: 16.7, color: '#f97316' },
    { risk: 'Medium', count: 89, percentage: 33.0, color: '#eab308' },
    { risk: 'Low', count: 113, percentage: 41.8, color: '#22c55e' },
  ];

  const monthlyChurnTrend = [
    { month: 'Jan', churnRate: 12.5, atRiskCustomers: 34 },
    { month: 'Feb', churnRate: 14.2, atRiskCustomers: 38 },
    { month: 'Mar', churnRate: 11.8, atRiskCustomers: 32 },
    { month: 'Apr', churnRate: 13.1, atRiskCustomers: 35 },
    { month: 'May', churnRate: 15.4, atRiskCustomers: 42 },
    { month: 'Jun', churnRate: 13.7, atRiskCustomers: 37 },
  ];

  const totalAtRisk = churnRiskData.reduce((sum, item) => sum + (item.risk === 'Critical' || item.risk === 'High' ? item.count : 0), 0);
  const currentChurnRate = monthlyChurnTrend[monthlyChurnTrend.length - 1]?.churnRate || 0;

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
      {/* Churn Risk Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Churn Risk Analysis
              </CardTitle>
              <CardDescription>Customer retention risk distribution</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/churn-analysis')}>
              View Details <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{totalAtRisk}</div>
                <div className="text-sm text-red-600">High Risk Customers</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{currentChurnRate}%</div>
                <div className="text-sm text-orange-600">Current Churn Rate</div>
              </div>
            </div>

            {/* Risk Distribution Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={churnRiskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {churnRiskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [
                    `${value} customers (${props.payload.percentage}%)`,
                    `${props.payload.risk} Risk`
                  ]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Legend */}
            <div className="flex flex-wrap gap-2">
              {churnRiskData.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-muted-foreground">
                    {item.risk} ({item.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Churn Trend Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-blue-500" />
                Churn Trend
              </CardTitle>
              <CardDescription>Monthly churn rate and at-risk customers</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              Last 6 months
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Trend Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChurnTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'churnRate' ? `${value}%` : value,
                      name === 'churnRate' ? 'Churn Rate' : 'At-Risk Customers'
                    ]}
                  />
                  <Bar 
                    dataKey="churnRate" 
                    fill="#3b82f6" 
                    name="churnRate"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Key Insights */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">May Peak</span>
                </div>
                <span className="text-sm text-yellow-700">15.4% churn rate</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Improvement</span>
                </div>
                <span className="text-sm text-green-700">-1.7% vs May</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Retention Value</span>
                </div>
                <span className="text-sm text-blue-700">₦2.8M at risk</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
