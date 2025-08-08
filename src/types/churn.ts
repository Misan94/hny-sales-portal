
export interface CustomerChurnData {
  customerId: string;
  customerName: string;
  churnScore: number;
  riskLevel: ChurnRiskLevel;
  recencyScore: number;
  frequencyScore: number;
  monetaryScore: number;
  daysSinceLastPurchase: number;
  totalPurchases: number;
  totalSpent: number;
  averageDaysBetweenPurchases: number;
  lastPurchaseDate: string;
  interventionRecommendations: string[];
}

export type ChurnRiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ChurnAnalytics {
  totalCustomers: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  averageChurnScore: number;
  customersAtRisk: CustomerChurnData[];
  recentChurners: CustomerChurnData[];
  retentionOpportunities: {
    customerCount: number;
    potentialRevenue: number;
  };
}

export interface ChurnMetrics {
  averageRecency: number;
  averageFrequency: number;
  averageMonetary: number;
  churnThreshold: number;
}
