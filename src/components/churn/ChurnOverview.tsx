
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChurnAnalytics } from '@/types/churn';

interface ChurnOverviewProps {
  analytics: ChurnAnalytics | undefined;
  isLoading: boolean;
}

export function ChurnOverview({ analytics, isLoading }: ChurnOverviewProps) {
  if (isLoading || !analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Churn Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const criticalPercentage = (analytics.riskDistribution.critical / analytics.totalCustomers) * 100;
  const highPercentage = (analytics.riskDistribution.high / analytics.totalCustomers) * 100;
  const mediumPercentage = (analytics.riskDistribution.medium / analytics.totalCustomers) * 100;
  const lowPercentage = (analytics.riskDistribution.low / analytics.totalCustomers) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Churn Risk Overview</CardTitle>
        <CardDescription>
          Customer distribution across risk levels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-destructive">Critical Risk</span>
            <span className="text-sm text-muted-foreground">
              {analytics.riskDistribution.critical} customers ({criticalPercentage.toFixed(1)}%)
            </span>
          </div>
          <Progress value={criticalPercentage} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-orange-600">High Risk</span>
            <span className="text-sm text-muted-foreground">
              {analytics.riskDistribution.high} customers ({highPercentage.toFixed(1)}%)
            </span>
          </div>
          <Progress value={highPercentage} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-yellow-600">Medium Risk</span>
            <span className="text-sm text-muted-foreground">
              {analytics.riskDistribution.medium} customers ({mediumPercentage.toFixed(1)}%)
            </span>
          </div>
          <Progress value={mediumPercentage} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-600">Low Risk</span>
            <span className="text-sm text-muted-foreground">
              {analytics.riskDistribution.low} customers ({lowPercentage.toFixed(1)}%)
            </span>
          </div>
          <Progress value={lowPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
