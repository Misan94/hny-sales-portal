import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { TrendingUp, Target, Users, ShoppingCart, BarChart3, Percent } from 'lucide-react';
import { useProductData, getPriceElasticityFromProducts, getCrossSellMatrixFromProducts } from '@/hooks/useProductData';

export default function PromotionInsights() {
  const { data: products, isLoading: productsLoading } = useProductData();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Get real product data for elasticity and cross-sell
  const priceElasticity = products ? getPriceElasticityFromProducts(products) : [];
  const crossSellMatrix = products ? getCrossSellMatrixFromProducts(products) : [];

  // Mock data for demonstration
  const promotionData = {
    roiDashboard: [
      { promo: 'Buy 2 Get 1 Free', roi: 185, baseline: 100, lift: 85, repeatRate: 34, status: 'Active' },
      { promo: '20% Off Weekend', roi: 142, baseline: 120, lift: 22, repeatRate: 28, status: 'Completed' },
      { promo: 'Back to School Bundle', roi: 210, baseline: 90, lift: 120, repeatRate: 42, status: 'Active' },
      { promo: 'Bulk Purchase Discount', roi: 95, baseline: 110, lift: -15, repeatRate: 18, status: 'Underperforming' },
    ],
    priceElasticity,
    consumerSegments: [
      { segment: 'Young Families', ageRange: '25-35', frequency: 'High', basketValue: '₦3,200', preferredCategories: ['Beverages', 'Snacks', 'Baby Care'] },
      { segment: 'Students', ageRange: '18-25', frequency: 'Medium', basketValue: '₦1,800', preferredCategories: ['Instant Foods', 'Beverages'] },
      { segment: 'Working Professionals', ageRange: '30-45', frequency: 'Medium', basketValue: '₦4,500', preferredCategories: ['Health Foods', 'Premium Beverages'] },
    ],
    crossSellMatrix
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promotion Insights</h1>
          <p className="text-muted-foreground">ROI analysis, price optimization, and consumer behavior insights</p>
        </div>
        <DateRangePicker
          date={dateRange}
          onDateChange={setDateRange}
          placeholder="Select analysis period"
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Across all channels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">158%</div>
            <p className="text-xs text-muted-foreground">+23% vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consumer Segments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Identified profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cross-sell Rate</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28%</div>
            <p className="text-xs text-muted-foreground">Bundle attachment rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Promo ROI Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Promo ROI Dashboard</CardTitle>
          <CardDescription>Performance analysis with lift vs. baseline and repeat-purchase rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {promotionData.roiDashboard.map((promo, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{promo.promo}</div>
                  <div className="text-sm text-muted-foreground">
                    Baseline: {promo.baseline} → Lift: +{promo.lift}% → Repeat: {promo.repeatRate}%
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium text-green-600">{promo.roi}% ROI</div>
                    <div className="text-sm text-muted-foreground">Return on investment</div>
                  </div>
                  <Badge 
                    variant={
                      promo.status === 'Active' ? 'default' : 
                      promo.status === 'Completed' ? 'secondary' : 'destructive'
                    }
                  >
                    {promo.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Elasticity & Cross-sell Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Price Elasticity Curves</CardTitle>
            <CardDescription>Optimal pricing recommendations for key SKUs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {promotionData.priceElasticity.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{item.sku}</div>
                    <div className="text-sm text-muted-foreground">
                      Current: ₦{item.currentPrice} → Optimal: ₦{item.optimalPrice}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{item.demandChange}</div>
                    <div className="text-sm text-muted-foreground">Elasticity: {item.elasticity}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cross-sell Opportunity Matrix</CardTitle>
            <CardDescription>High-affinity product bundles for increased ticket sizes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {promotionData.crossSellMatrix.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex-1">
                    <div className="font-medium">{item.primaryProduct}</div>
                    <div className="text-sm text-muted-foreground">
                      Pair with: {item.recommendedProduct}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-medium text-blue-600">{item.uplift}</div>
                      <div className="text-sm text-muted-foreground">Revenue uplift</div>
                    </div>
                    <Badge variant="secondary">
                      {(item.coIndex * 100).toFixed(0)}% Affinity
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
