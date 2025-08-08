
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardMetrics {
  totalCustomers: number;
  newCustomersThisMonth: number;
  totalTransactions: number;
  totalRevenue: number;
  topProducts: Array<{
    name: string;
    count: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export function useDashboardData() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch customer metrics
      const { data: customers, error: customersError } = await supabase
        .from('fmcg sample customer data')
        .select('*');

      if (customersError) throw customersError;

      // Fetch transaction metrics
      const { data: transactions, error: transactionsError } = await supabase
        .from('fmcg sample transaction data')
        .select('*');

      if (transactionsError) throw transactionsError;

      // Fetch product metrics
      const { data: products, error: productsError } = await supabase
        .from('fcmg sample product list')
        .select('*');

      if (productsError) throw productsError;

      // Calculate metrics
      const totalCustomers = customers?.length || 0;
      const totalTransactions = transactions?.length || 0;
      
      // Calculate total revenue
      const totalRevenue = transactions?.reduce((sum, t) => {
        const cost = parseFloat(t['Transaction Cost']?.replace(/[^\d.-]/g, '') || '0');
        return sum + cost;
      }, 0) || 0;

      // Get top products by transaction count
      const productCounts = transactions?.reduce((acc, t) => {
        const productName = t['Product Name'];
        if (productName) {
          acc[productName] = (acc[productName] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      const topProducts = Object.entries(productCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      // Get category distribution
      const categoryCounts = transactions?.reduce((acc, t) => {
        const category = t['Category'];
        if (category) {
          acc[category] = (acc[category] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      const categoryDistribution = Object.entries(categoryCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 6)
        .map(([category, count]) => ({ category, count }));

      // Calculate new customers this month (simulated)
      const newCustomersThisMonth = Math.floor(totalCustomers * 0.15);

      // Generate recent activity (simulated)
      const recentActivity = [
        {
          type: 'customer',
          description: 'New customer registration',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          type: 'transaction',
          description: 'High-value transaction completed',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
        },
        {
          type: 'product',
          description: 'Product recommendation generated',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
        }
      ];

      const dashboardMetrics: DashboardMetrics = {
        totalCustomers,
        newCustomersThisMonth,
        totalTransactions,
        totalRevenue,
        topProducts,
        categoryDistribution,
        recentActivity
      };

      setMetrics(dashboardMetrics);
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return { metrics, loading, error, refreshData: fetchDashboardMetrics };
}
