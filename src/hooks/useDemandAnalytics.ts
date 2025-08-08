import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/transaction';
import { SupabaseCustomer } from '@/types/customer';

export interface DemandVelocityData {
  productName: string;
  volume: number;
  velocity: 'fast' | 'medium' | 'slow';
  trend: number;
  revenueContribution: number;
}

export interface CategoryPerformanceData {
  category: string;
  volume: number;
  revenue: number;
  growth: number;
  marketShare: number;
}

export interface BrandPerformanceData {
  brand: string;
  volume: number;
  revenue: number;
  loyaltyScore: number;
  marketPosition: number;
}

export interface GeographicDemandData {
  location: string;
  volume: number;
  topProducts: string[];
  growthRate: number;
}

export interface PackSizeAnalysisData {
  packSize: number;
  volume: number;
  category: string;
  profitability: number;
  preference: number;
}

export interface PurchasePatternsData {
  period: string;
  volume: number;
  avgOrderValue: number;
  frequency: number;
  seasonality: number;
}

export interface DemandAnalyticsData {
  demandVelocity: DemandVelocityData[];
  categoryPerformance: CategoryPerformanceData[];
  brandPerformance: BrandPerformanceData[];
  geographicDemand: GeographicDemandData[];
  packSizeAnalysis: PackSizeAnalysisData[];
  purchasePatterns: PurchasePatternsData[];
  totalTransactions: number;
  totalRevenue: number;
  uniqueProducts: number;
  avgOrderValue: number;
}

export function useDemandAnalytics() {
  const [data, setData] = useState<DemandAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDemandAnalytics();
  }, []);

  const fetchDemandAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch transactions and customers data
      const [transactionsResult, customersResult] = await Promise.all([
        supabase.from('fmcg sample transaction data').select('*'),
        supabase.from('fmcg sample customer data').select('*')
      ]);

      if (transactionsResult.error) throw transactionsResult.error;
      if (customersResult.error) throw customersResult.error;

      const transactions = transactionsResult.data as Transaction[];
      const customers = customersResult.data as SupabaseCustomer[];

      // Process demand analytics
      const analytics = processDemandAnalytics(transactions, customers);
      setData(analytics);
    } catch (err) {
      console.error('Error fetching demand analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch demand analytics');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchDemandAnalytics };
}

function processDemandAnalytics(
  transactions: Transaction[],
  customers: SupabaseCustomer[]
): DemandAnalyticsData {
  // Create customer lookup for geographic data
  const customerLookup = customers.reduce((acc, customer) => {
    acc[customer['Customer ID']] = customer;
    return acc;
  }, {} as Record<string, SupabaseCustomer>);

  // Filter valid transactions
  const validTransactions = transactions.filter(t => 
    t['Product Name'] && 
    t['Transaction Cost'] && 
    parseFloat(t['Transaction Cost'].replace(/[^\d.-]/g, '')) > 0
  );

  // Calculate total metrics
  const totalRevenue = validTransactions.reduce((sum, t) => 
    sum + parseFloat(t['Transaction Cost']?.replace(/[^\d.-]/g, '') || '0'), 0
  );
  const uniqueProducts = new Set(validTransactions.map(t => t['Product Name'])).size;
  const avgOrderValue = totalRevenue / validTransactions.length;

  // Process demand velocity
  const demandVelocity = processDemandVelocity(validTransactions);
  
  // Process category performance
  const categoryPerformance = processCategoryPerformance(validTransactions);
  
  // Process brand performance
  const brandPerformance = processBrandPerformance(validTransactions);
  
  // Process geographic demand
  const geographicDemand = processGeographicDemand(validTransactions, customerLookup);
  
  // Process pack size analysis
  const packSizeAnalysis = processPackSizeAnalysis(validTransactions);
  
  // Process purchase patterns
  const purchasePatterns = processPurchasePatterns(validTransactions);

  return {
    demandVelocity,
    categoryPerformance,
    brandPerformance,
    geographicDemand,
    packSizeAnalysis,
    purchasePatterns,
    totalTransactions: validTransactions.length,
    totalRevenue,
    uniqueProducts,
    avgOrderValue
  };
}

function processDemandVelocity(transactions: Transaction[]): DemandVelocityData[] {
  const productStats = transactions.reduce((acc, t) => {
    const productName = t['Product Name']!;
    const revenue = parseFloat(t['Transaction Cost']?.replace(/[^\d.-]/g, '') || '0');
    
    if (!acc[productName]) {
      acc[productName] = { volume: 0, revenue: 0 };
    }
    acc[productName].volume += 1;
    acc[productName].revenue += revenue;
    return acc;
  }, {} as Record<string, { volume: number; revenue: number }>);

  const totalRevenue = Object.values(productStats).reduce((sum, p) => sum + p.revenue, 0);
  const sortedProducts = Object.entries(productStats)
    .sort(([,a], [,b]) => b.volume - a.volume)
    .slice(0, 20);

  return sortedProducts.map(([productName, stats], index) => {
    const revenueContribution = (stats.revenue / totalRevenue) * 100;
    let velocity: 'fast' | 'medium' | 'slow' = 'slow';
    
    if (index < 5) velocity = 'fast';
    else if (index < 12) velocity = 'medium';
    
    return {
      productName,
      volume: stats.volume,
      velocity,
      trend: Math.random() * 20 - 10, // Simulated trend
      revenueContribution
    };
  });
}

function processCategoryPerformance(transactions: Transaction[]): CategoryPerformanceData[] {
  const categoryStats = transactions.reduce((acc, t) => {
    const category = t.Category || 'Unknown';
    const revenue = parseFloat(t['Transaction Cost']?.replace(/[^\d.-]/g, '') || '0');
    
    if (!acc[category]) {
      acc[category] = { volume: 0, revenue: 0 };
    }
    acc[category].volume += 1;
    acc[category].revenue += revenue;
    return acc;
  }, {} as Record<string, { volume: number; revenue: number }>);

  const totalRevenue = Object.values(categoryStats).reduce((sum, c) => sum + c.revenue, 0);
  
  return Object.entries(categoryStats)
    .sort(([,a], [,b]) => b.revenue - a.revenue)
    .map(([category, stats]) => ({
      category,
      volume: stats.volume,
      revenue: stats.revenue,
      growth: Math.random() * 30 - 10, // Simulated growth
      marketShare: (stats.revenue / totalRevenue) * 100
    }));
}

function processBrandPerformance(transactions: Transaction[]): BrandPerformanceData[] {
  const brandStats = transactions.reduce((acc, t) => {
    const brand = t.Brand || 'Unknown';
    const revenue = parseFloat(t['Transaction Cost']?.replace(/[^\d.-]/g, '') || '0');
    
    if (!acc[brand]) {
      acc[brand] = { volume: 0, revenue: 0 };
    }
    acc[brand].volume += 1;
    acc[brand].revenue += revenue;
    return acc;
  }, {} as Record<string, { volume: number; revenue: number }>);

  return Object.entries(brandStats)
    .sort(([,a], [,b]) => b.revenue - a.revenue)
    .slice(0, 10)
    .map(([brand, stats], index) => ({
      brand,
      volume: stats.volume,
      revenue: stats.revenue,
      loyaltyScore: Math.random() * 100, // Simulated loyalty score
      marketPosition: index + 1
    }));
}

function processGeographicDemand(
  transactions: Transaction[],
  customerLookup: Record<string, SupabaseCustomer>
): GeographicDemandData[] {
  const locationStats = transactions.reduce((acc, t) => {
    const customer = customerLookup[t['Customer ID'] || ''];
    const location = customer?.State || 'Unknown';
    const productName = t['Product Name'];
    
    if (!acc[location]) {
      acc[location] = { volume: 0, products: new Set() };
    }
    acc[location].volume += 1;
    if (productName) acc[location].products.add(productName);
    return acc;
  }, {} as Record<string, { volume: number; products: Set<string> }>);

  return Object.entries(locationStats)
    .sort(([,a], [,b]) => b.volume - a.volume)
    .slice(0, 10)
    .map(([location, stats]) => ({
      location,
      volume: stats.volume,
      topProducts: Array.from(stats.products).slice(0, 3),
      growthRate: Math.random() * 25 - 5 // Simulated growth rate
    }));
}

function processPackSizeAnalysis(transactions: Transaction[]): PackSizeAnalysisData[] {
  const packSizeStats = transactions.reduce((acc, t) => {
    const packSize = t['Unit Pack Size'] || 0;
    const category = t.Category || 'Unknown';
    const revenue = parseFloat(t['Transaction Cost']?.replace(/[^\d.-]/g, '') || '0');
    
    const key = `${packSize}-${category}`;
    if (!acc[key]) {
      acc[key] = { packSize, category, volume: 0, revenue: 0 };
    }
    acc[key].volume += 1;
    acc[key].revenue += revenue;
    return acc;
  }, {} as Record<string, { packSize: number; category: string; volume: number; revenue: number }>);

  return Object.values(packSizeStats)
    .filter(stats => stats.packSize > 0)
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 15)
    .map(stats => ({
      packSize: stats.packSize,
      volume: stats.volume,
      category: stats.category,
      profitability: (stats.revenue / stats.volume), // Revenue per unit
      preference: stats.volume / Object.values(packSizeStats).reduce((sum, s) => sum + s.volume, 0) * 100
    }));
}

function processPurchasePatterns(transactions: Transaction[]): PurchasePatternsData[] {
  const monthlyStats = transactions.reduce((acc, t) => {
    const date = new Date(t.Date || '');
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const revenue = parseFloat(t['Transaction Cost']?.replace(/[^\d.-]/g, '') || '0');
    
    if (!acc[monthKey]) {
      acc[monthKey] = { volume: 0, revenue: 0, customers: new Set() };
    }
    acc[monthKey].volume += 1;
    acc[monthKey].revenue += revenue;
    if (t['Customer ID']) acc[monthKey].customers.add(t['Customer ID']);
    return acc;
  }, {} as Record<string, { volume: number; revenue: number; customers: Set<string> }>);

  return Object.entries(monthlyStats)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12) // Last 12 months
    .map(([period, stats]) => ({
      period,
      volume: stats.volume,
      avgOrderValue: stats.revenue / stats.volume,
      frequency: stats.volume / stats.customers.size,
      seasonality: Math.random() * 2 // Simulated seasonality index
    }));
}