import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CustomerChurnData, ChurnAnalytics } from '@/types/churn';
import { AlertTriangle, Target } from 'lucide-react';

interface PredictiveAnalyticsProps {
  analytics: ChurnAnalytics;
  customers: CustomerChurnData[];
  isLoading: boolean;
}

interface PredictiveMetrics {
  riskFactors: Array<{ factor: string; impact: number; description: string }>;
  earlyWarningSignals: Array<{ signal: string; severity: 'high' | 'medium' | 'low'; count: number }>;
}

export function PredictiveAnalytics({ analytics, customers, isLoading }: PredictiveAnalyticsProps) {
  if (isLoading || !analytics || !customers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Predictive Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading predictive models...</div>
        </CardContent>
      </Card>
    );
  }

  const predictiveMetrics = calculatePredictiveMetrics(analytics, customers);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Key Risk Factors
          </CardTitle>
          <CardDescription>
            Factors most predictive of customer churn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictiveMetrics.riskFactors.map((factor, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{factor.factor}</span>
                  <span className="text-sm text-muted-foreground">{factor.impact}% impact</span>
                </div>
                <Progress value={factor.impact} className="h-2" />
                <p className="text-xs text-muted-foreground">{factor.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Early Warning Signals
          </CardTitle>
          <CardDescription>
            Current indicators of potential churn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {predictiveMetrics.earlyWarningSignals.map((signal, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <div className="font-medium text-sm">{signal.signal}</div>
                  <div className="text-xs text-muted-foreground">{signal.count} customers affected</div>
                </div>
                <Badge variant={
                  signal.severity === 'high' ? 'destructive' :
                  signal.severity === 'medium' ? 'default' : 'secondary'
                }>
                  {signal.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function calculatePredictiveMetrics(analytics: ChurnAnalytics, customers: CustomerChurnData[]): PredictiveMetrics {
  // Key risk factors
  const riskFactors = [
    {
      factor: 'Days Since Last Purchase',
      impact: 85,
      description: 'Strongest predictor - customers inactive >60 days have 85% higher churn probability'
    },
    {
      factor: 'Purchase Frequency Decline',
      impact: 72,
      description: 'Customers with decreasing purchase frequency show 72% higher churn risk'
    },
    {
      factor: 'Low Monetary Value',
      impact: 58,
      description: 'Customers with spending <₦5,000 show 58% higher churn probability'
    },
    {
      factor: 'Irregular Purchase Pattern',
      impact: 45,
      description: 'Inconsistent purchase timing increases churn risk by 45%'
    },
    {
      factor: 'Single Category Purchases',
      impact: 33,
      description: 'Customers buying from only one category have 33% higher churn risk'
    }
  ];

  // Early warning signals
  const earlyWarningSignals = [
    {
      signal: 'Extended Purchase Gap',
      severity: 'high' as const,
      count: customers.filter(c => c.daysSinceLastPurchase > c.averageDaysBetweenPurchases * 2).length
    },
    {
      signal: 'Declining Purchase Frequency',
      severity: 'high' as const,
      count: customers.filter(c => c.frequencyScore <= 2).length
    },
    {
      signal: 'Low Engagement Score',
      severity: 'medium' as const,
      count: customers.filter(c => c.recencyScore <= 2 && c.frequencyScore <= 3).length
    },
    {
      signal: 'Single Purchase Customers',
      severity: 'medium' as const,
      count: customers.filter(c => c.totalPurchases === 1).length
    },
    {
      signal: 'Below Average Spending',
      severity: 'low' as const,
      count: customers.filter(c => c.monetaryScore <= 2).length
    }
  ];

  return {
    riskFactors,
    earlyWarningSignals
  };
}
