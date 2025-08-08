import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, ShoppingCart, ArrowRight, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useProductData, getCategoryPerformanceFromProducts } from '@/hooks/useProductData';

interface PurchaseAnalysisPreviewProps {
  metrics: any;
}

export function PurchaseAnalysisPreview({ metrics }: PurchaseAnalysisPreviewProps) {
  const navigate = useNavigate();
  const { data: products, isLoading: productsLoading } = useProductData();

  // Mock purchase analysis data for demonstration
  const purchaseTrends = [
    { month: 'Jan', transactions: 2340, revenue: 12500000, avgOrder: 5342 },
    { month: 'Feb', transactions: 2580, revenue: 13800000, avgOrder: 5349 },
    { month: 'Mar', transactions: 2420, revenue: 13200000, avgOrder: 5454 },
    { month: 'Apr', transactions: 2680, revenue: 14600000, avgOrder: 5448 },
    { month: 'May', transactions: 2920, revenue: 16200000, avgOrder: 5548 },
    { month: 'Jun', transactions: 3150, revenue: 17800000, avgOrder: 5651 },
  ];

  // Get real category performance from products data
  const categoryPerformance = products ? getCategoryPerformanceFromProducts(products) : [];

  const totalRevenue = purchaseTrends[purchaseTrends.length - 1]?.revenue || 0;
  const totalTransactions = purchaseTrends[purchaseTrends.length - 1]?.transactions || 0;
  const avgOrderValue = purchaseTrends[purchaseTrends.length - 1]?.avgOrder || 0;

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
      {/* Purchase Trends */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Purchase Trends
              </CardTitle>
              <CardDescription>Transaction volume and revenue growth</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/demand-analytics')}>
              View Details <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{totalTransactions.toLocaleString()}</div>
                <div className="text-xs text-blue-600">Transactions</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">₦{(totalRevenue / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-green-600">Revenue</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">₦{avgOrderValue.toLocaleString()}</div>
                <div className="text-xs text-purple-600">Avg Order</div>
              </div>
            </div>

            {/* Trend Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={purchaseTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `₦${(value as number / 1000000).toFixed(1)}M` : 
                      name === 'transactions' ? (value as number).toLocaleString() :
                      `₦${(value as number).toLocaleString()}`,
                      name === 'revenue' ? 'Revenue' : 
                      name === 'transactions' ? 'Transactions' : 'Avg Order Value'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Growth Indicators */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Monthly Growth</span>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-700">
                +34% vs last month
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-orange-500" />
                Category Performance
              </CardTitle>
              <CardDescription>Revenue distribution by product category</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              Top 5 Categories
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Category Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryPerformance} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="category" 
                    tick={{ fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'share' ? `${value}%` : `₦${(value as number / 1000000).toFixed(1)}M`,
                      name === 'share' ? 'Market Share' : 'Revenue'
                    ]}
                  />
                  <Bar 
                    dataKey="share" 
                    fill="#f97316" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Details */}
            <div className="space-y-2">
              {categoryPerformance.slice(0, 3).map((category, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ 
                        backgroundColor: index === 0 ? '#f97316' : 
                                        index === 1 ? '#fb923c' : '#fdba74' 
                      }}
                    ></div>
                    <span className="text-sm font-medium">{category.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{category.share}%</span>
                    <Badge 
                      variant={category.growth >= 10 ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      +{category.growth}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Insight */}
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Top 3 Categories</span>
              </div>
              <span className="text-sm text-blue-700">81% of total revenue</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
