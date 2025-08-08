import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { TrendingUp, MapPin, Clock, Calendar, Thermometer, GraduationCap } from 'lucide-react';

export default function DemandPulse() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  // Mock data for demonstration
  const realTimeData = {
    topPerformingSKUs: [
      { sku: 'COCA-500ML', value: '₦2.4M', location: 'Lagos', velocity: 'High', daysOnHand: 2.1 },
      { sku: 'INDOMIE-70G', value: '₦1.8M', location: 'Abuja', velocity: 'High', daysOnHand: 1.8 },
      { sku: 'PEAK-400G', value: '₦1.2M', location: 'Kano', velocity: 'Medium', daysOnHand: 3.2 },
      { sku: 'MAGGI-CUBE', value: '₦980K', location: 'Port Harcourt', velocity: 'High', daysOnHand: 2.5 },
    ],
    promoRedemptions: [
      { promo: 'Buy 2 Get 1 Free', location: 'Victoria Island', coordinates: '6.4281, 3.4219', redemptions: 145 },
      { promo: '20% Off Weekend', location: 'Ikeja', coordinates: '6.5954, 3.3364', redemptions: 89 },
      { promo: 'Back to School', location: 'Surulere', coordinates: '6.4969, 3.3553', redemptions: 67 },
    ],
    seasonalEvents: [
      { event: 'Ramadan', impact: 'High', category: 'Religious', status: 'Upcoming' },
      { event: 'Back to School', impact: 'Medium', category: 'Academic', status: 'Active' },
      { event: 'Harmattan Season', impact: 'Low', category: 'Weather', status: 'Active' },
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Demand Pulse</h1>
          <p className="text-muted-foreground">Real-time sell-through and market velocity insights</p>
        </div>
        <DateRangePicker
          date={dateRange}
          onDateChange={setDateRange}
          placeholder="Select analysis period"
        />
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Sales Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦12.8M</div>
            <p className="text-xs text-muted-foreground">+18% vs yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">Across 6 states</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Velocity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3</div>
            <p className="text-xs text-muted-foreground">Days on hand</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promo Redemptions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">301</div>
            <p className="text-xs text-muted-foreground">Today so far</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing SKUs */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Sell-through by SKU</CardTitle>
          <CardDescription>Live performance data by product, value, and location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {realTimeData.topPerformingSKUs.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{item.sku}</div>
                  <div className="text-sm text-muted-foreground">{item.location}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">{item.value}</div>
                    <div className="text-sm text-muted-foreground">{item.daysOnHand} days on hand</div>
                  </div>
                  <Badge variant={item.velocity === 'High' ? 'default' : item.velocity === 'Medium' ? 'secondary' : 'outline'}>
                    {item.velocity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* USSD Promo Redemptions & Seasonal Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>USSD Promo Redemptions</CardTitle>
            <CardDescription>Mapped by geo-coordinates & timestamp</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {realTimeData.promoRedemptions.map((promo, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{promo.promo}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {promo.location} ({promo.coordinates})
                    </div>
                  </div>
                  <Badge>{promo.redemptions} redemptions</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seasonality & Event Overlays</CardTitle>
            <CardDescription>Holidays, weather, and school term impacts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {realTimeData.seasonalEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-3">
                    {event.category === 'Religious' && <Calendar className="h-4 w-4" />}
                    {event.category === 'Academic' && <GraduationCap className="h-4 w-4" />}
                    {event.category === 'Weather' && <Thermometer className="h-4 w-4" />}
                    <div>
                      <div className="font-medium">{event.event}</div>
                      <div className="text-sm text-muted-foreground">{event.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={event.impact === 'High' ? 'destructive' : event.impact === 'Medium' ? 'default' : 'secondary'}>
                      {event.impact} Impact
                    </Badge>
                    <Badge variant="outline">{event.status}</Badge>
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
          <CardTitle>Why Demand Pulse Matters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Spot Hot Zones</h4>
              <p className="text-sm text-blue-700 mt-1">Identify high-demand areas before shelves run dry</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Clear Slow Movers</h4>
              <p className="text-sm text-green-700 mt-1">Free up cash by identifying products that need promotion</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900">Plan for Peaks</h4>
              <p className="text-sm text-purple-700 mt-1">Prepare extra stock for Ramadan, back-to-school, and seasonal events</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
