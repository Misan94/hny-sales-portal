
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChurnAnalytics } from '@/types/churn';
import { Target, Users, DollarSign, Clock } from 'lucide-react';

interface InterventionRecommendationsProps {
  analytics: ChurnAnalytics | undefined;
  isLoading: boolean;
}

export function InterventionRecommendations({ analytics, isLoading }: InterventionRecommendationsProps) {
  if (isLoading || !analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Intervention Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const criticalCustomers = analytics.customersAtRisk.filter(c => c.riskLevel === 'Critical');
  const highRiskCustomers = analytics.customersAtRisk.filter(c => c.riskLevel === 'High');
  const immediateActionNeeded = analytics.customersAtRisk.filter(c => c.daysSinceLastPurchase > 120);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Intervention Recommendations
        </CardTitle>
        <CardDescription>
          Actionable strategies to reduce customer churn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Immediate Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-destructive">🚨 Immediate Action Required</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="font-medium">Critical Risk Customers</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{criticalCustomers.length}</div>
              <p className="text-sm text-muted-foreground">
                Customers with 80%+ churn probability
              </p>
              <div className="mt-2 space-y-1">
                <Badge variant="destructive" className="text-xs">Personal outreach</Badge>
                <Badge variant="destructive" className="text-xs">Immediate discount offer</Badge>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-orange-600" />
                <span className="font-medium">Dormant Customers</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{immediateActionNeeded.length}</div>
              <p className="text-sm text-muted-foreground">
                No purchases in 120+ days
              </p>
              <div className="mt-2 space-y-1">
                <Badge variant="secondary" className="text-xs">Win-back campaign</Badge>
                <Badge variant="secondary" className="text-xs">Product recommendations</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Interventions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">📋 Strategic Interventions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Recency-Based</h4>
              <p className="text-sm text-muted-foreground mb-3">
                For customers with declining purchase frequency
              </p>
              <div className="space-y-1">
                <Badge variant="outline" className="text-xs block w-fit">Email reminders</Badge>
                <Badge variant="outline" className="text-xs block w-fit">Push notifications</Badge>
                <Badge variant="outline" className="text-xs block w-fit">Personalized offers</Badge>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Frequency-Based</h4>
              <p className="text-sm text-muted-foreground mb-3">
                For infrequent shoppers
              </p>
              <div className="space-y-1">
                <Badge variant="outline" className="text-xs block w-fit">Loyalty programs</Badge>
                <Badge variant="outline" className="text-xs block w-fit">Bundle deals</Badge>
                <Badge variant="outline" className="text-xs block w-fit">Subscription options</Badge>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Value-Based</h4>
              <p className="text-sm text-muted-foreground mb-3">
                For low-spending customers
              </p>
              <div className="space-y-1">
                <Badge variant="outline" className="text-xs block w-fit">Premium samples</Badge>
                <Badge variant="outline" className="text-xs block w-fit">Upsell campaigns</Badge>
                <Badge variant="outline" className="text-xs block w-fit">Value demonstrations</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Projections */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">💰 Retention Value</h3>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">High-Risk Customer Value</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Total historical spend from at-risk customers
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">₦{analytics.retentionOpportunities.potentialRevenue.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">{analytics.retentionOpportunities.customerCount} customers</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <strong>Success Scenario:</strong> Retaining 50% of high-risk customers could preserve{' '}
              <strong>₦{(analytics.retentionOpportunities.potentialRevenue * 0.5).toLocaleString()}</strong> in annual revenue.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
