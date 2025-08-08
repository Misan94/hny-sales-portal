import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Users, TrendingDown, DollarSign } from 'lucide-react';
import { CustomerChurnData, ChurnAnalytics, ChurnRiskLevel } from '@/types/churn';
import { ChurnOverview } from '@/components/churn/ChurnOverview';
import { CustomerRiskList } from '@/components/churn/CustomerRiskList';
import { PredictiveAnalytics } from '@/components/churn/PredictiveAnalytics';
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface TransactionData {
  'Customer ID': string;
  'Product Name': string;
  'Category': string;
  'Date': string;
  'Transaction Cost': string;
  'Transaction ID': string;
}
interface CustomerData {
  'Customer ID': string;
  'First Name': string;
  'Last Name': string;
  'Age': number;
  'Gender': string;
  'Household Size': number;
  'State': string;
  'Local Government': string;
}
export default function ChurnPrediction() {
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<ChurnRiskLevel | 'All'>('All');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 90),
    to: new Date(),
  });

  // Fetch transaction data
  const {
    data: transactions,
    isLoading: transactionsLoading
  } = useQuery({
    queryKey: ['churn-transactions'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('fmcg sample transaction data').select('*').order('Date', {
        ascending: true
      });
      if (error) throw error;
      return data as TransactionData[];
    }
  });

  // Fetch customer data
  const {
    data: customers,
    isLoading: customersLoading
  } = useQuery({
    queryKey: ['churn-customers'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('fmcg sample customer data').select('*');
      if (error) throw error;
      return data as CustomerData[];
    }
  });

  // Calculate churn analytics
  const {
    data: churnAnalytics,
    isLoading: analyticsLoading
  } = useQuery({
    queryKey: ['churn-analytics', transactions, customers],
    queryFn: () => calculateChurnAnalytics(transactions || [], customers || []),
    enabled: !!transactions && !!customers
  });
  const filteredCustomers = churnAnalytics?.customersAtRisk.filter(customer => selectedRiskLevel === 'All' || customer.riskLevel === selectedRiskLevel) || [];
  return <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Churn Analysis</h1>
          <p className="text-muted-foreground">Customer loyalty analysis based on purchase patterns and customer behavior</p>
        </div>
        <DateRangePicker
          date={dateRange}
          onDateChange={setDateRange}
          placeholder="Select analysis period"
        />
      </div>

      {/* Analytics Overview */}
      {!analyticsLoading && churnAnalytics && <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{churnAnalytics.totalCustomers}</div>
                <p className="text-xs text-muted-foreground">Active customer base</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">At Risk</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {churnAnalytics.riskDistribution.high + churnAnalytics.riskDistribution.critical}
                </div>
                <p className="text-xs text-muted-foreground">High risk + Critical</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Churn Score</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{churnAnalytics.averageChurnScore.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Out of 100</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Retention Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{churnAnalytics.retentionOpportunities.potentialRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Potential revenue at risk</p>
              </CardContent>
            </Card>
          </div>

          {/* Churn Risk Overview */}
          <ChurnOverview analytics={churnAnalytics} isLoading={analyticsLoading} />

          {/* Key Risk Factors and Early Warning Signals */}
          <PredictiveAnalytics 
            analytics={churnAnalytics} 
            customers={churnAnalytics.customersAtRisk} 
            isLoading={analyticsLoading} 
          />

          {/* Customer Risk Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Customer Risk Analysis</CardTitle>
                  <CardDescription>
                    Customers ranked by churn propensity score
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {(['All', 'Critical', 'High', 'Medium', 'Low'] as const).map(level => <Badge key={level} variant={selectedRiskLevel === level ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedRiskLevel(level)}>
                      {level}
                    </Badge>)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CustomerRiskList customers={filteredCustomers} isLoading={analyticsLoading} />
            </CardContent>
          </Card>
        </>}

      {(transactionsLoading || customersLoading || analyticsLoading) && <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading churn analysis...</div>
        </div>}
    </div>;
}
function calculateChurnAnalytics(transactions: TransactionData[], customers: CustomerData[]): ChurnAnalytics {
  const today = new Date();
  const customerMetrics = new Map<string, {
    totalSpent: number;
    totalPurchases: number;
    lastPurchaseDate: Date;
    firstPurchaseDate: Date;
    purchaseDates: Date[];
  }>();

  // Calculate customer metrics
  transactions.forEach(transaction => {
    const customerId = transaction['Customer ID'];
    const amount = parseFloat(transaction['Transaction Cost']?.replace(/[^\d.-]/g, '') || '0');
    const date = new Date(transaction['Date']);
    if (!customerMetrics.has(customerId)) {
      customerMetrics.set(customerId, {
        totalSpent: 0,
        totalPurchases: 0,
        lastPurchaseDate: date,
        firstPurchaseDate: date,
        purchaseDates: []
      });
    }
    const metrics = customerMetrics.get(customerId)!;
    metrics.totalSpent += amount;
    metrics.totalPurchases += 1;
    metrics.purchaseDates.push(date);
    if (date > metrics.lastPurchaseDate) {
      metrics.lastPurchaseDate = date;
    }
    if (date < metrics.firstPurchaseDate) {
      metrics.firstPurchaseDate = date;
    }
  });

  // Calculate churn scores for each customer
  const customersAtRisk: CustomerChurnData[] = [];
  const riskDistribution = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0
  };
  let totalChurnScore = 0;
  customers.forEach(customer => {
    const customerId = customer['Customer ID'];
    const metrics = customerMetrics.get(customerId);
    if (!metrics) return;
    const daysSinceLastPurchase = Math.floor((today.getTime() - metrics.lastPurchaseDate.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate average days between purchases
    const sortedDates = metrics.purchaseDates.sort((a, b) => a.getTime() - b.getTime());
    let totalDaysBetween = 0;
    for (let i = 1; i < sortedDates.length; i++) {
      totalDaysBetween += Math.floor((sortedDates[i].getTime() - sortedDates[i - 1].getTime()) / (1000 * 60 * 60 * 24));
    }
    const averageDaysBetweenPurchases = sortedDates.length > 1 ? totalDaysBetween / (sortedDates.length - 1) : 30;

    // Calculate RFM scores (1-5 scale, lower is worse)
    const recencyScore = daysSinceLastPurchase <= 30 ? 5 : daysSinceLastPurchase <= 60 ? 4 : daysSinceLastPurchase <= 90 ? 3 : daysSinceLastPurchase <= 180 ? 2 : 1;
    const frequencyScore = metrics.totalPurchases >= 10 ? 5 : metrics.totalPurchases >= 7 ? 4 : metrics.totalPurchases >= 4 ? 3 : metrics.totalPurchases >= 2 ? 2 : 1;
    const monetaryScore = metrics.totalSpent >= 50000 ? 5 : metrics.totalSpent >= 30000 ? 4 : metrics.totalSpent >= 15000 ? 3 : metrics.totalSpent >= 5000 ? 2 : 1;

    // Calculate churn score (0-100, higher means more likely to churn)
    const baseChurnScore = 100 - (recencyScore + frequencyScore + monetaryScore) / 15 * 100;

    // Additional penalty for customers who haven't purchased recently relative to their pattern
    const expectedRepurchaseWindow = averageDaysBetweenPurchases * 1.5;
    const latePenalty = daysSinceLastPurchase > expectedRepurchaseWindow ? Math.min(30, (daysSinceLastPurchase - expectedRepurchaseWindow) / 10) : 0;
    const churnScore = Math.min(100, baseChurnScore + latePenalty);

    // Determine risk level
    const riskLevel: ChurnRiskLevel = churnScore >= 80 ? 'Critical' : churnScore >= 60 ? 'High' : churnScore >= 40 ? 'Medium' : 'Low';

    // Generate intervention recommendations
    const interventionRecommendations: string[] = [];
    if (recencyScore <= 2) {
      interventionRecommendations.push('Send re-engagement email campaign');
      interventionRecommendations.push('Offer personalized discount');
    }
    if (frequencyScore <= 2) {
      interventionRecommendations.push('Create loyalty program incentive');
      interventionRecommendations.push('Recommend complementary products');
    }
    if (monetaryScore <= 2) {
      interventionRecommendations.push('Offer bundle deals');
      interventionRecommendations.push('Introduce premium product samples');
    }
    if (daysSinceLastPurchase > expectedRepurchaseWindow) {
      interventionRecommendations.push('Immediate outreach required');
      interventionRecommendations.push('Check satisfaction with last purchase');
    }
    const customerChurnData: CustomerChurnData = {
      customerId,
      customerName: `${customer['First Name']} ${customer['Last Name']}`,
      churnScore: Math.round(churnScore),
      riskLevel,
      recencyScore,
      frequencyScore,
      monetaryScore,
      daysSinceLastPurchase,
      totalPurchases: metrics.totalPurchases,
      totalSpent: metrics.totalSpent,
      averageDaysBetweenPurchases: Math.round(averageDaysBetweenPurchases),
      lastPurchaseDate: metrics.lastPurchaseDate.toISOString().split('T')[0],
      interventionRecommendations
    };
    customersAtRisk.push(customerChurnData);
    riskDistribution[riskLevel.toLowerCase() as keyof typeof riskDistribution]++;
    totalChurnScore += churnScore;
  });

  // Sort by churn score (highest risk first)
  customersAtRisk.sort((a, b) => b.churnScore - a.churnScore);

  // Calculate retention opportunities (focus on high-value at-risk customers)
  const highValueAtRisk = customersAtRisk.filter(c => c.riskLevel === 'High' || c.riskLevel === 'Critical');
  const potentialRevenue = highValueAtRisk.reduce((sum, customer) => sum + customer.totalSpent, 0);
  return {
    totalCustomers: customers.length,
    riskDistribution,
    averageChurnScore: totalChurnScore / customers.length,
    customersAtRisk,
    recentChurners: customersAtRisk.filter(c => c.daysSinceLastPurchase > 90).slice(0, 10),
    retentionOpportunities: {
      customerCount: highValueAtRisk.length,
      potentialRevenue
    }
  };
}