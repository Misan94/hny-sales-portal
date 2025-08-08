import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Map, TrendingUp, MapPin, ArrowRight, Building, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface GrowthMapsPreviewProps {
  metrics: any;
}

export function GrowthMapsPreview({ metrics }: GrowthMapsPreviewProps) {
  const navigate = useNavigate();

  // Mock growth maps data for demonstration
  const territoryExpansion = [
    { territory: 'Lekki Phase 2', potential: 2800000, coverage: 0, priority: 'Critical', population: 45000 },
    { territory: 'Ajah New Town', potential: 1900000, coverage: 25, priority: 'High', population: 32000 },
    { territory: 'Ikorodu Ext.', potential: 1500000, coverage: 0, priority: 'Medium', population: 28000 },
    { territory: 'Magodo Ph 3', potential: 800000, coverage: 65, priority: 'Low', population: 18000 },
  ];

  const shareOfWallet = [
    { region: 'Victoria Island', share: 50, potential: 50, color: '#22c55e' },
    { region: 'Ikeja GRA', share: 43, potential: 57, color: '#3b82f6' },
    { region: 'Surulere', share: 57, potential: 43, color: '#f59e0b' },
    { region: 'Yaba', share: 39, potential: 61, color: '#ef4444' },
  ];

  const marketOpportunities = [
    { type: 'White Space Areas', count: 23, value: 18000000, status: 'High Priority' },
    { type: 'Underperforming', count: 12, value: 8500000, status: 'Medium Priority' },
    { type: 'Expansion Ready', count: 8, value: 12000000, status: 'Investment Ready' },
  ];

  const totalOpportunityValue = marketOpportunities.reduce((sum, opp) => sum + opp.value, 0);
  const highPriorityAreas = territoryExpansion.filter(t => t.priority === 'Critical' || t.priority === 'High').length;

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
      {/* Territory Expansion Opportunities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-green-500" />
                Territory Expansion
              </CardTitle>
              <CardDescription>High-potential areas for market expansion</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/growth-maps')}>
              View Details <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{highPriorityAreas}</div>
                <div className="text-sm text-green-600">High Priority Areas</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">₦{(totalOpportunityValue / 1000000).toFixed(0)}M</div>
                <div className="text-sm text-blue-600">Market Opportunity</div>
              </div>
            </div>

            {/* Expansion Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={territoryExpansion}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="territory" 
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    formatter={(value) => [`₦${(value as number / 1000000).toFixed(1)}M`, 'Market Potential']}
                  />
                  <Bar 
                    dataKey="potential" 
                    fill="#22c55e" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Opportunities */}
            <div className="space-y-2">
              {territoryExpansion.slice(0, 3).map((territory, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{territory.territory}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      ₦{(territory.potential / 1000000).toFixed(1)}M
                    </span>
                    <Badge 
                      variant={
                        territory.priority === 'Critical' ? 'destructive' : 
                        territory.priority === 'High' ? 'default' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {territory.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share of Wallet Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Market Share Analysis
              </CardTitle>
              <CardDescription>Current vs potential market penetration</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              Top 4 Regions
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Share of Wallet Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shareOfWallet}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="share"
                  >
                    {shareOfWallet.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value}%`,
                      `${props.payload.region} Share`
                    ]} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Regional Details */}
            <div className="space-y-2">
              {shareOfWallet.map((region, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: region.color }}
                    ></div>
                    <span className="text-sm font-medium">{region.region}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {region.share}% / {region.potential}%
                    </span>
                    <Badge 
                      variant={region.potential > region.share ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {region.potential > region.share ? 'Growth Opportunity' : 'Saturated'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Market Opportunities Summary */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Market Opportunities</h4>
              {marketOpportunities.map((opportunity, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">{opportunity.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {opportunity.count} areas • ₦{(opportunity.value / 1000000).toFixed(0)}M
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Growth Potential Indicator */}
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Total Growth Potential</span>
              </div>
              <span className="text-sm text-purple-700">₦{(totalOpportunityValue / 1000000).toFixed(0)}M untapped</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
