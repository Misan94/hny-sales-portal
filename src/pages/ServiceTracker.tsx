import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Truck, Clock, AlertTriangle, DollarSign, CheckCircle, XCircle } from 'lucide-react';

export default function ServiceTracker() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Mock data for demonstration
  const serviceData = {
    deliveryMetrics: [
      { route: 'Lagos - Victoria Island', otifScore: 94, fillRate: 98, avgDeliveryTime: 2.1, cost: 450 },
      { route: 'Abuja - Garki', otifScore: 87, fillRate: 92, avgDeliveryTime: 3.2, cost: 380 },
      { route: 'Kano - Sabon Gari', otifScore: 91, fillRate: 95, avgDeliveryTime: 2.8, cost: 320 },
      { route: 'Port Harcourt - GRA', otifScore: 89, fillRate: 89, avgDeliveryTime: 3.5, cost: 420 },
    ],
    returnsData: [
      { batch: 'BT2024001', product: 'COCA-500ML', quantity: 24, reason: 'Near Expiry', value: 6000, status: 'Processed' },
      { batch: 'BT2024002', product: 'PEAK-400G', quantity: 12, reason: 'Damaged Packaging', value: 9600, status: 'Pending' },
      { batch: 'BT2024003', product: 'INDOMIE-70G', quantity: 48, reason: 'Quality Issue', value: 5760, status: 'Investigating' },
    ],
    routeEfficiency: [
      { route: 'Route A - Lagos Central', distance: 45, stops: 12, cost: 580, efficiency: 92, consolidationOpportunity: 'High' },
      { route: 'Route B - Ikeja Cluster', distance: 38, stops: 8, cost: 420, efficiency: 88, consolidationOpportunity: 'Medium' },
      { route: 'Route C - Mainland', distance: 52, stops: 15, cost: 650, efficiency: 85, consolidationOpportunity: 'Low' },
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Performance Tracker</h1>
          <p className="text-muted-foreground">Delivery metrics, returns analysis, and logistics optimization</p>
        </div>
        <DateRangePicker
          date={dateRange}
          onDateChange={setDateRange}
          placeholder="Select tracking period"
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg OTIF Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90%</div>
            <p className="text-xs text-muted-foreground">On-time, in-full delivery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fill Rate</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Order completeness</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.9</div>
            <p className="text-xs text-muted-foreground">Days from PO to delivery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returns Value</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦21.4K</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Order-to-Delivery Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order-to-Delivery Performance</CardTitle>
          <CardDescription>OTIF scores, fill rates, and delivery timelines by route</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceData.deliveryMetrics.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{route.route}</div>
                  <div className="text-sm text-muted-foreground">
                    Avg delivery: {route.avgDeliveryTime} days • Cost per case: ₦{route.cost}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">{route.otifScore}% OTIF</div>
                    <div className="text-sm text-muted-foreground">{route.fillRate}% Fill Rate</div>
                  </div>
                  <Badge 
                    variant={route.otifScore >= 95 ? 'default' : route.otifScore >= 85 ? 'secondary' : 'destructive'}
                  >
                    {route.otifScore >= 95 ? 'Excellent' : route.otifScore >= 85 ? 'Good' : 'Needs Attention'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Returns & Route Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Returns & Near-Expiry Inventory</CardTitle>
            <CardDescription>Batch tracking with reason codes and values</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceData.returnsData.map((return_, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{return_.product}</div>
                    <div className="text-sm text-muted-foreground">
                      Batch: {return_.batch} • Qty: {return_.quantity} • Reason: {return_.reason}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₦{return_.value.toLocaleString()}</div>
                    <Badge 
                      variant={
                        return_.status === 'Processed' ? 'default' : 
                        return_.status === 'Pending' ? 'secondary' : 'destructive'
                      }
                    >
                      {return_.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Route Efficiency Analysis</CardTitle>
            <CardDescription>Cost optimization and consolidation opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceData.routeEfficiency.map((route, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{route.route}</div>
                    <div className="text-sm font-medium">{route.efficiency}% Efficient</div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {route.distance}km • {route.stops} stops • ₦{route.cost} total cost
                  </div>
                  <Badge 
                    variant={
                      route.consolidationOpportunity === 'High' ? 'destructive' : 
                      route.consolidationOpportunity === 'Medium' ? 'default' : 'secondary'
                    }
                  >
                    {route.consolidationOpportunity} Consolidation Opportunity
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Level Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Service Level Summary</CardTitle>
          <CardDescription>Key performance indicators for joint business reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h4 className="font-medium">Delivery Excellence</h4>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">OTIF Score</span>
                  <span className="text-sm font-medium">90%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Fill Rate</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Delivery</span>
                  <span className="text-sm font-medium">2.9 days</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <h4 className="font-medium">Quality Issues</h4>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Returns Rate</span>
                  <span className="text-sm font-medium">0.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Near Expiry</span>
                  <span className="text-sm font-medium">1.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Damage Rate</span>
                  <span className="text-sm font-medium">0.3%</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium">Cost Efficiency</h4>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Cost per Case</span>
                  <span className="text-sm font-medium">₦393</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Route Efficiency</span>
                  <span className="text-sm font-medium">88%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Savings Potential</span>
                  <span className="text-sm font-medium">₦1.2M/mo</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Why it matters section */}
      <Card>
        <CardHeader>
          <CardTitle>Why Service Performance Tracker Matters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Quantify Service Levels</h4>
              <p className="text-sm text-blue-700 mt-1">Provide concrete metrics for joint business reviews</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Flag Issues Early</h4>
              <p className="text-sm text-green-700 mt-1">Identify delivery or quality problems before they escalate</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900">Optimize Logistics</h4>
              <p className="text-sm text-purple-700 mt-1">Find routes ready for consolidation to protect margins</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
