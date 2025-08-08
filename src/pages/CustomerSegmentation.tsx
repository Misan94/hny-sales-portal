import { useState, useEffect } from "react";
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SegmentOverview } from "@/components/segmentation/SegmentOverview";
import { RFMDistribution } from "@/components/segmentation/RFMDistribution";
import { PackSizeAnalysis } from "@/components/segmentation/PackSizeAnalysis";
import { DateRangePicker } from '@/components/ui/date-range-picker';

import { CustomerSegment, RFMData } from "@/types/segmentation";
const CustomerSegmentation = () => {
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [rfmData, setRfmData] = useState<RFMData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 90),
    to: new Date(),
  });
  const {
    toast
  } = useToast();
  useEffect(() => {
    calculateRFMSegmentation();
  }, []);
  const calculateRFMSegmentation = async () => {
    try {
      setIsLoading(true);
      const {
        data: transactions,
        error
      } = await supabase.from('fmcg sample transaction data').select('*');
      if (error) throw error;
      const customerMetrics = new Map();
      const today = new Date();
      transactions?.forEach(transaction => {
        const customerId = transaction['Customer ID'];
        const transactionDate = new Date(transaction.Date || '');
        const cost = parseFloat(transaction['Transaction Cost']?.replace('₦', '').replace(',', '') || '0');
        const packSize = transaction['Unit Pack Size'] || 0;
        if (!customerMetrics.has(customerId)) {
          customerMetrics.set(customerId, {
            customerId,
            lastPurchaseDate: transactionDate,
            totalSpend: 0,
            transactionCount: 0,
            packSizes: [],
            recency: 0,
            frequency: 0,
            monetary: 0,
            packSizePreference: ''
          });
        }
        const metrics = customerMetrics.get(customerId);
        metrics.totalSpend += cost;
        metrics.transactionCount += 1;
        metrics.packSizes.push(packSize);
        if (transactionDate > metrics.lastPurchaseDate) {
          metrics.lastPurchaseDate = transactionDate;
        }
      });
      const rfmResults: RFMData[] = [];
      const segmentCounts = new Map();
      customerMetrics.forEach((metrics, customerId) => {
        const recency = Math.floor((today.getTime() - metrics.lastPurchaseDate.getTime()) / (1000 * 60 * 60 * 24));
        const frequency = metrics.transactionCount;
        const monetary = metrics.totalSpend;
        const avgPackSize = metrics.packSizes.reduce((a, b) => a + b, 0) / metrics.packSizes.length;
        let packSizePreference = 'Medium';
        if (avgPackSize <= 100) packSizePreference = 'Small';else if (avgPackSize >= 500) packSizePreference = 'Large';
        const segment = determineSegment(recency, frequency, monetary, packSizePreference);
        rfmResults.push({
          customerId,
          recency,
          frequency,
          monetary,
          packSizePreference,
          segment,
          avgPackSize
        });
        segmentCounts.set(segment, (segmentCounts.get(segment) || 0) + 1);
      });
      const segmentSummary: CustomerSegment[] = Array.from(segmentCounts.entries()).map(([name, count]) => ({
        name,
        count,
        percentage: count / rfmResults.length * 100,
        description: getSegmentDescription(name),
        color: getSegmentColor(name)
      }));
      setRfmData(rfmResults);
      setSegments(segmentSummary);
    } catch (error) {
      console.error('Error calculating RFM segmentation:', error);
      toast({
        title: "Error",
        description: "Failed to calculate customer segmentation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const determineSegment = (recency: number, frequency: number, monetary: number, packSize: string): string => {
    if (recency <= 30 && frequency >= 5 && monetary >= 50000) return 'Champions';
    if (recency <= 60 && frequency >= 3 && monetary >= 30000) return 'Loyal Customers';
    if (recency <= 90 && frequency >= 2 && monetary >= 15000) return 'Potential Loyalists';
    if (recency <= 30 && frequency === 1) return 'New Customers';
    if (recency > 90 && frequency >= 3 && monetary >= 20000) return 'At Risk';
    if (recency > 180 && frequency >= 5 && monetary >= 40000) return 'Cannot Lose Them';
    if (packSize === 'Small' && monetary < 20000) return 'Price Sensitive';
    if (packSize === 'Large' && frequency >= 2) return 'Bulk Buyers';
    return 'Others';
  };
  const getSegmentDescription = (segment: string): string => {
    const descriptions = {
      'Champions': 'High value, frequent buyers who purchased recently',
      'Loyal Customers': 'Regular customers with good purchase history',
      'Potential Loyalists': 'Recent customers with growing engagement',
      'New Customers': 'Recent first-time buyers to nurture',
      'At Risk': 'Previously good customers who haven\'t bought recently',
      'Cannot Lose Them': 'High-value customers at risk of churning',
      'Price Sensitive': 'Customers who prefer smaller, cheaper packs',
      'Bulk Buyers': 'Customers who purchase large quantities',
      'Others': 'Customers that don\'t fit other segments'
    };
    return descriptions[segment] || 'Other customer segment';
  };
  const getSegmentColor = (segment: string): string => {
    const colors = {
      'Champions': '#10B981',
      'Loyal Customers': '#3B82F6',
      'Potential Loyalists': '#8B5CF6',
      'New Customers': '#06B6D4',
      'At Risk': '#F59E0B',
      'Cannot Lose Them': '#EF4444',
      'Price Sensitive': '#6B7280',
      'Bulk Buyers': '#84CC16',
      'Others': '#9CA3AF'
    };
    return colors[segment] || '#9CA3AF';
  };
  if (isLoading) {
    return <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Segmentation</h1>
          <p className="text-muted-foreground">Customer segmentation based on Recency, Frequency, Monetary value analysis</p>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-200 rounded-lg" />)}
        </div>
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Segments</h1>
          <p className="text-muted-foreground">Customer segmentation based on Recency, Frequency, Monetary Value analysis</p>
        </div>
        <DateRangePicker
          date={dateRange}
          onDateChange={setDateRange}
          placeholder="Select analysis period"
        />
      </div>

      <SegmentOverview segments={segments} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RFMDistribution data={rfmData} />
        <PackSizeAnalysis data={rfmData} />
      </div>

      
    </div>;
};
export default CustomerSegmentation;