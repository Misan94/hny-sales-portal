import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { AlertTriangle, TrendingUp, Package, DollarSign, Brain, Clock } from 'lucide-react';

export default function SmartReorderCenter() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 14),
    to: new Date(),
  });

  // Mock data for demonstration
  const reorderData = {
    mlSuggestions: [
      { sku: 'COCA-500ML', currentStock: 45, suggestedOrder: 120, leadTime: 3, riskLevel: 'High', profitMargin: 22 },
      { sku: 'INDOMIE-70G', currentStock: 78, suggestedOrder: 200, leadTime: 2, riskLevel: 'Medium', profitMargin: 18 },
      { sku: 'PEAK-400G', currentStock: 23, suggestedOrder: 80, leadTime: 4, riskLevel: 'Critical', profitMargin: 25 },
      { sku: 'MAGGI-CUBE', currentStock: 156, suggestedOrder: 150, leadTime: 2, riskLevel: 'Low', profitMargin: 20 },
    ],
    stockSnapshot: {
      totalSKUs: 247,
      lowStock: 23,
      outOfStock: 8,
      overstocked: 12,
      avgDaysCoverage: 8.5
    },
    profitCalculator: [
      { packSize: '24x500ml', landedCost: 4800, suggestedPrice: 6000, margin: 25, volume: 'High' },
      { packSize: '12x500ml', landedCost: 2500, suggestedPrice: 3100, margin: 24, volume: 'Medium' },
      { packSize: '6x500ml', landedCost: 1300, suggestedPrice: 1600, margin: 23, volume: 'Low' },
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Reorder Center</h1>
          <p className="text-muted-foreground">ML-powered demand forecasting and inventory optimization</p>
        </div>
        <DateRangePicker
          date={dateRange}
          onDateChange={setDateRange}
          placeholder="Select forecast period"
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Coverage</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reorderData.stockSnapshot.avgDaysCoverage}</div>
            <p className="text-xs text-muted-foreground">Days average coverage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reorderData.stockSnapshot.lowStock + reorderData.stockSnapshot.outOfStock}</div>
            <p className="text-xs text-muted-foreground">SKUs need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ML Predictions</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Forecast accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦2.8M</div>
            <p className="text-xs text-muted-foreground">Cash flow optimization</p>
          </CardContent>
        </Card>
      </div>

      {/* ML-Based Reorder Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>ML-Based Demand Forecast & Order Suggestions</CardTitle>
          <CardDescription>AI-powered recommendations based on historical patterns and market trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reorderData.mlSuggestions.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{item.sku}</div>
                  <div className="text-sm text-muted-foreground">
                    Current: {item.currentStock} cases • Lead time: {item.leadTime} days
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">Order: {item.suggestedOrder} cases</div>
                    <div className="text-sm text-muted-foreground">{item.profitMargin}% margin</div>
                  </div>
                  <Badge 
                    variant={
                      item.riskLevel === 'Critical' ? 'destructive' : 
                      item.riskLevel === 'High' ? 'default' : 
                      item.riskLevel === 'Medium' ? 'secondary' : 'outline'
                    }
                  >
                    {item.riskLevel} Risk
                  </Badge>
                  <Button size="sm">
                    Order Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stock Snapshot & Profit Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Live Stock Snapshot</CardTitle>
            <CardDescription>Current inventory levels and coverage analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-2xl font-bold">{reorderData.stockSnapshot.totalSKUs}</div>
                  <div className="text-sm text-muted-foreground">Total SKUs</div>
                </div>
                <div className="p-3 bg-red-50 rounded">
                  <div className="text-2xl font-bold text-red-600">{reorderData.stockSnapshot.outOfStock}</div>
                  <div className="text-sm text-red-600">Out of Stock</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-yellow-50 rounded">
                  <div className="text-2xl font-bold text-yellow-600">{reorderData.stockSnapshot.lowStock}</div>
                  <div className="text-sm text-yellow-600">Low Stock</div>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <div className="text-2xl font-bold text-blue-600">{reorderData.stockSnapshot.overstocked}</div>
                  <div className="text-sm text-blue-600">Overstocked</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price-Pack Profit Calculator</CardTitle>
            <CardDescription>Optimize pack mix for maximum profitability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reorderData.profitCalculator.map((pack, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{pack.packSize}</div>
                    <div className="text-sm text-muted-foreground">
                      Cost: ₦{pack.landedCost.toLocaleString()} → Price: ₦{pack.suggestedPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">{pack.margin}%</div>
                    <Badge variant={pack.volume === 'High' ? 'default' : pack.volume === 'Medium' ? 'secondary' : 'outline'}>
                      {pack.volume} Volume
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Why it matters section */}
      <Card>
        <CardHeader>
          <CardTitle>Why Smart Reorder Center Matters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Cut Guesswork</h4>
              <p className="text-sm text-blue-700 mt-1">Eliminate phone tag with reps through data-driven ordering</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Prevent Cash Crunches</h4>
              <p className="text-sm text-green-700 mt-1">Avoid over-ordering and optimize cash flow management</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900">Maximize Profits</h4>
              <p className="text-sm text-purple-700 mt-1">Choose the right pack mix to hit profit goals consistently</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
