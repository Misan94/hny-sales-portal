import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Users, TrendingDown, ArrowRight, CheckCircle, Clock, Target, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChurnAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChurnAnalysisModal({ isOpen, onClose }: ChurnAnalysisModalProps) {
  const navigate = useNavigate();

  // Mock churn analysis summary data
  const churnData = {
    totalCustomers: 2847,
    analysisDate: new Date().toLocaleDateString(),
    processingTime: '1.8 seconds',
    accuracy: 91.7,
    atRiskCustomers: 387,
    churnRate: 13.6,
    potentialRevenueLoss: 4200000,
    riskSegments: [
      {
        segment: 'High Risk',
        count: 127,
        percentage: 4.5,
        avgDaysSinceLastPurchase: 95,
        avgLifetimeValue: 45000,
        color: 'red'
      },
      {
        segment: 'Medium Risk',
        count: 184,
        percentage: 6.5,
        avgDaysSinceLastPurchase: 65,
        avgLifetimeValue: 32000,
        color: 'orange'
      },
      {
        segment: 'Low Risk',
        count: 76,
        percentage: 2.7,
        avgDaysSinceLastPurchase: 45,
        avgLifetimeValue: 28000,
        color: 'yellow'
      }
    ],
    topRiskFactors: [
      { factor: 'Purchase Frequency Decline', impact: 89, description: 'Customers buying 60% less frequently than usual' },
      { factor: 'Order Value Drop', impact: 76, description: 'Average order value decreased by 40% or more' },
      { factor: 'Extended Inactivity', impact: 68, description: 'No purchases in the last 90+ days' },
      { factor: 'Category Abandonment', impact: 54, description: 'Stopped purchasing from preferred categories' }
    ],
    interventionRecommendations: [
      {
        action: 'Personalized Re-engagement Campaign',
        target: 'High Risk Customers',
        expectedImpact: '25-30% retention improvement',
        urgency: 'Critical'
      },
      {
        action: 'Loyalty Incentive Program',
        target: 'Medium Risk Customers',
        expectedImpact: '15-20% retention improvement',
        urgency: 'High'
      },
      {
        action: 'Win-back Promotions',
        target: 'Recently Inactive Customers',
        expectedImpact: '35-40% reactivation rate',
        urgency: 'Medium'
      }
    ]
  };

  const handleViewFullReport = () => {
    onClose();
    navigate('/churn-analysis');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'red': return 'bg-red-50 border-red-200 text-red-800';
      case 'orange': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'yellow': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'destructive';
      case 'High': return 'default';
      case 'Medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <DialogTitle className="text-xl">Churn Analysis Report</DialogTitle>
          </div>
          <DialogDescription>
            Customer retention analysis and churn risk assessment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Analysis Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Analysis Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{churnData.totalCustomers.toLocaleString()}</div>
                  <div className="text-sm text-blue-700">Customers Analyzed</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{churnData.churnRate}%</div>
                  <div className="text-sm text-red-700">Churn Rate</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{churnData.atRiskCustomers}</div>
                  <div className="text-sm text-orange-700">At-Risk Customers</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">₦{(churnData.potentialRevenueLoss / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-purple-700">Revenue at Risk</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Segments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Customer Risk Segments
              </CardTitle>
              <CardDescription>Breakdown of customers by churn risk level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {churnData.riskSegments.map((segment, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getRiskColor(segment.color)}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-lg">{segment.segment}</div>
                        <Badge variant="outline">{segment.count} customers</Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{segment.percentage}%</div>
                        <div className="text-sm opacity-75">of total base</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Avg. Days Since Last Purchase</div>
                        <div className="text-lg font-semibold">{segment.avgDaysSinceLastPurchase} days</div>
                      </div>
                      <div>
                        <div className="font-medium">Avg. Lifetime Value</div>
                        <div className="text-lg font-semibold">₦{segment.avgLifetimeValue.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Risk Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-600" />
                Top Risk Factors
              </CardTitle>
              <CardDescription>Key indicators contributing to customer churn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {churnData.topRiskFactors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{factor.factor}</div>
                      <div className="text-sm text-muted-foreground">{factor.description}</div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-bold text-lg text-red-600">{factor.impact}%</div>
                      <div className="text-sm text-muted-foreground">impact score</div>
                      <Progress value={factor.impact} className="w-20 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Intervention Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Recommended Interventions
              </CardTitle>
              <CardDescription>Strategic actions to reduce customer churn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {churnData.interventionRecommendations.map((recommendation, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-lg">{recommendation.action}</div>
                      <Badge variant={getUrgencyColor(recommendation.urgency) as any}>
                        {recommendation.urgency}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground">Target Segment</div>
                        <div>{recommendation.target}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Expected Impact</div>
                        <div className="text-green-600 font-semibold">{recommendation.expectedImpact}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleViewFullReport} className="flex-1">
              <AlertTriangle className="mr-2 h-4 w-4" />
              View Full Report
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close Summary
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
