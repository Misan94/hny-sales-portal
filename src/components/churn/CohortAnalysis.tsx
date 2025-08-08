import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerChurnData } from '@/types/churn';

interface CohortAnalysisProps {
  customers: CustomerChurnData[];
  isLoading: boolean;
}

interface CohortData {
  cohort: string;
  totalCustomers: number;
  activeCustomers: number;
  retentionRate: number;
  avgChurnScore: number;
  avgDaysSinceLastPurchase: number;
}

export function CohortAnalysis({ customers, isLoading }: CohortAnalysisProps) {
  if (isLoading || !customers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cohort Retention Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading cohort data...</div>
        </CardContent>
      </Card>
    );
  }

  const cohortData = calculateCohortAnalysis(customers);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Cohort Analysis</CardTitle>
        <CardDescription>
          Retention patterns by customer acquisition periods
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Cohort Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Acquisition Period</th>
                  <th className="text-right p-2 font-medium">Total Customers</th>
                  <th className="text-right p-2 font-medium">Active Customers</th>
                  <th className="text-right p-2 font-medium">Retention Rate</th>
                  <th className="text-right p-2 font-medium">Avg Churn Score</th>
                  <th className="text-right p-2 font-medium">Avg Days Inactive</th>
                </tr>
              </thead>
              <tbody>
                {cohortData.map((cohort, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{cohort.cohort}</td>
                    <td className="p-2 text-right">{cohort.totalCustomers}</td>
                    <td className="p-2 text-right">{cohort.activeCustomers}</td>
                    <td className="p-2 text-right">
                      <span className={`font-medium ${
                        cohort.retentionRate >= 70 ? 'text-green-600' :
                        cohort.retentionRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {cohort.retentionRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-2 text-right">
                      <span className={`font-medium ${
                        cohort.avgChurnScore <= 40 ? 'text-green-600' :
                        cohort.avgChurnScore <= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {cohort.avgChurnScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="p-2 text-right">{cohort.avgDaysSinceLastPurchase.toFixed(0)} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key Insights */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Key Insights</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              {generateCohortInsights(cohortData).map((insight, index) => (
                <div key={index}>• {insight}</div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function calculateCohortAnalysis(customers: CustomerChurnData[]): CohortData[] {
  // Group customers by their first purchase quarter (simulated from last purchase - avg days between)
  const cohorts: { [key: string]: CustomerChurnData[] } = {};
  
  customers.forEach(customer => {
    const lastPurchaseDate = new Date(customer.lastPurchaseDate);
    const estimatedFirstPurchase = new Date(lastPurchaseDate.getTime() - (customer.averageDaysBetweenPurchases * customer.totalPurchases * 24 * 60 * 60 * 1000));
    
    const cohortKey = `Q${Math.ceil((estimatedFirstPurchase.getMonth() + 1) / 3)} ${estimatedFirstPurchase.getFullYear()}`;
    
    if (!cohorts[cohortKey]) {
      cohorts[cohortKey] = [];
    }
    cohorts[cohortKey].push(customer);
  });

  // Calculate metrics for each cohort
  return Object.entries(cohorts)
    .map(([cohort, cohortCustomers]) => {
      const totalCustomers = cohortCustomers.length;
      const activeCustomers = cohortCustomers.filter(c => c.daysSinceLastPurchase <= 90).length;
      const retentionRate = (activeCustomers / totalCustomers) * 100;
      const avgChurnScore = cohortCustomers.reduce((sum, c) => sum + c.churnScore, 0) / totalCustomers;
      const avgDaysSinceLastPurchase = cohortCustomers.reduce((sum, c) => sum + c.daysSinceLastPurchase, 0) / totalCustomers;

      return {
        cohort,
        totalCustomers,
        activeCustomers,
        retentionRate,
        avgChurnScore,
        avgDaysSinceLastPurchase
      };
    })
    .sort((a, b) => b.cohort.localeCompare(a.cohort))
    .slice(0, 8); // Show last 8 quarters
}

function generateCohortInsights(cohortData: CohortData[]): string[] {
  const insights: string[] = [];
  
  if (cohortData.length === 0) return insights;

  // Find best and worst performing cohorts
  const sortedByRetention = [...cohortData].sort((a, b) => b.retentionRate - a.retentionRate);
  const bestCohort = sortedByRetention[0];
  const worstCohort = sortedByRetention[sortedByRetention.length - 1];

  insights.push(`Best performing cohort: ${bestCohort.cohort} with ${bestCohort.retentionRate.toFixed(1)}% retention`);
  insights.push(`Worst performing cohort: ${worstCohort.cohort} with ${worstCohort.retentionRate.toFixed(1)}% retention`);

  // Overall retention trend
  const avgRetention = cohortData.reduce((sum, c) => sum + c.retentionRate, 0) / cohortData.length;
  insights.push(`Average retention rate across cohorts: ${avgRetention.toFixed(1)}%`);

  // Recent cohorts performance
  const recentCohorts = cohortData.slice(0, 3);
  const recentAvgRetention = recentCohorts.reduce((sum, c) => sum + c.retentionRate, 0) / recentCohorts.length;
  
  if (recentAvgRetention > avgRetention) {
    insights.push(`Recent cohorts show improved retention (${recentAvgRetention.toFixed(1)}% vs ${avgRetention.toFixed(1)}%)`);
  } else {
    insights.push(`Recent cohorts show declining retention (${recentAvgRetention.toFixed(1)}% vs ${avgRetention.toFixed(1)}%)`);
  }

  return insights;
}
