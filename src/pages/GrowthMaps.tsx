import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Map, TrendingUp, Users, Building, Target, MapPin } from 'lucide-react';

export default function GrowthMaps() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 90),
    to: new Date(),
  });

  // Mock data for demonstration
  const growthData = {
    whiteSpaceAreas: [
      { area: 'Lekki Phase 2', population: 45000, potential: 'High', activeWholesalers: 0, estimatedValue: '₦2.8M', priority: 'Critical' },
      { area: 'Ajah New Town', population: 32000, potential: 'Medium', activeWholesalers: 1, estimatedValue: '₦1.9M', priority: 'High' },
      { area: 'Ikorodu Extension', population: 28000, potential: 'Medium', activeWholesalers: 0, estimatedValue: '₦1.5M', priority: 'Medium' },
      { area: 'Magodo Phase 3', population: 18000, potential: 'Low', activeWholesalers: 2, estimatedValue: '₦800K', priority: 'Low' },
    ],
    coverageAnalysis: [
      { depot: 'Lagos Central Depot', coverage: 85, potential: 92, gap: 7, repsAssigned: 8, territories: 12 },
      { depot: 'Abuja Main Depot', coverage: 78, potential: 88, gap: 10, repsAssigned: 6, territories: 9 },
      { depot: 'Kano Distribution Center', coverage: 82, potential: 90, gap: 8, repsAssigned: 5, territories: 8 },
      { depot: 'Port Harcourt Hub', coverage: 75, potential: 85, gap: 10, repsAssigned: 4, territories: 6 },
    ],
    shareOfWallet: [
      { territory: 'Victoria Island', yourVolume: 2400, categorySize: 4800, shareOfWallet: 50, growthPotential: 'Medium' },
      { territory: 'Ikeja GRA', yourVolume: 1800, categorySize: 4200, shareOfWallet: 43, growthPotential: 'High' },
      { territory: 'Surulere', yourVolume: 3200, categorySize: 5600, shareOfWallet: 57, growthPotential: 'Low' },
      { territory: 'Yaba', yourVolume: 1500, categorySize: 3800, shareOfWallet: 39, growthPotential: 'High' },
    ],
    expansionOpportunities: [
      { opportunity: 'New Sub-distributor - Lekki', investment: '₦15M', paybackPeriod: '18 months', riskLevel: 'Medium', expectedROI: '165%' },
      { opportunity: 'Depot Expansion - Abuja', investment: '₦25M', paybackPeriod: '24 months', riskLevel: 'Low', expectedROI: '145%' },
      { opportunity: 'Territory Split - Lagos Mainland', investment: '₦8M', paybackPeriod: '12 months', riskLevel: 'Low', expectedROI: '180%' },
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Growth Opportunities</h1>
          <p className="text-muted-foreground">Territory expansion analysis and market opportunity mapping</p>
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
            <CardTitle className="text-sm font-medium">White Space Areas</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">High-potential uncovered areas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Coverage</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80%</div>
            <p className="text-xs text-muted-foreground">Market reach vs potential</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Share of Wallet</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47%</div>
            <p className="text-xs text-muted-foreground">Avg across territories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Potential</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦18M</div>
            <p className="text-xs text-muted-foreground">Untapped market value</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* White Space Heat Map - Left Side (2/3 width) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>White Space Heat Map</CardTitle>
              <CardDescription>Consumer hotspots with no active wholesaler coverage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {growthData.whiteSpaceAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{area.area}</div>
                      <div className="text-sm text-muted-foreground">
                        Population: {area.population.toLocaleString()} • Active Wholesalers: {area.activeWholesalers}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">{area.estimatedValue}</div>
                        <div className="text-sm text-muted-foreground">Est. monthly value</div>
                      </div>
                      <Badge 
                        variant={
                          area.priority === 'Critical' ? 'destructive' : 
                          area.priority === 'High' ? 'default' : 
                          area.priority === 'Medium' ? 'secondary' : 'outline'
                        }
                      >
                        {area.priority} Priority
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Growth Insights - Right Side (1/3 width) */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Market Growth Insights</CardTitle>
              <CardDescription>Strategic recommendations for territory expansion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    High-Priority Areas
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-red-50 rounded">
                      <div className="font-medium text-red-900">Lekki Phase 2</div>
                      <div className="text-sm text-red-700">45K population, zero coverage, ₦2.8M potential</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded">
                      <div className="font-medium text-orange-900">Ajah New Town</div>
                      <div className="text-sm text-orange-700">32K population, limited coverage, ₦1.9M potential</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Quick Wins
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-green-50 rounded">
                      <div className="font-medium text-green-900">Territory Split - Lagos Mainland</div>
                      <div className="text-sm text-green-700">₦8M investment, 12-month payback, 180% ROI</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="font-medium text-blue-900">Ikeja GRA Expansion</div>
                      <div className="text-sm text-blue-700">43% share of wallet, high growth potential</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Coverage Analysis & Share of Wallet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Coverage vs. Potential Reach</CardTitle>
            <CardDescription>Depot performance and territory optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {growthData.coverageAnalysis.map((depot, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{depot.depot}</div>
                    <div className="text-sm font-medium">{depot.coverage}% Coverage</div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Potential: {depot.potential}% • Gap: {depot.gap}% • Reps: {depot.repsAssigned} • Territories: {depot.territories}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${depot.coverage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Share-of-Wallet Analysis</CardTitle>
            <CardDescription>Your volume vs. total category size by territory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {growthData.shareOfWallet.map((territory, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{territory.territory}</div>
                    <Badge 
                      variant={
                        territory.growthPotential === 'High' ? 'default' : 
                        territory.growthPotential === 'Medium' ? 'secondary' : 'outline'
                      }
                    >
                      {territory.growthPotential} Growth
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Your Volume: {territory.yourVolume} vs Category: {territory.categorySize}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${territory.shareOfWallet}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{territory.shareOfWallet}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expansion Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Territory Expansion Opportunities</CardTitle>
          <CardDescription>Investment opportunities with ROI projections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {growthData.expansionOpportunities.map((opportunity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{opportunity.opportunity}</div>
                  <div className="text-sm text-muted-foreground">
                    Investment: {opportunity.investment} • Payback: {opportunity.paybackPeriod}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium text-green-600">{opportunity.expectedROI}</div>
                    <div className="text-sm text-muted-foreground">Expected ROI</div>
                  </div>
                  <Badge 
                    variant={
                      opportunity.riskLevel === 'Low' ? 'default' : 
                      opportunity.riskLevel === 'Medium' ? 'secondary' : 'destructive'
                    }
                  >
                    {opportunity.riskLevel} Risk
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
