import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, TrendingUp, Users, Package, Target } from 'lucide-react';
import { CustomerRecommendation, ProductRecommendation, TransitionMatrix, RecommendationAnalytics, PredictionAnalytics, ProductPrediction, CustomerPrediction, DemographicAnalytics, DemographicPrediction } from '@/types/recommendation';
import { RecommendationEngine } from '@/components/recommendations/RecommendationEngine';
import { TransitionHeatmap } from '@/components/recommendations/TransitionHeatmap';
import { CategoryFlow } from '@/components/recommendations/CategoryFlow';
import { ProductPredictions } from '@/components/recommendations/ProductPredictions';
import { DemographicProductPredictions } from '@/components/recommendations/DemographicProductPredictions';
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface TransactionData {
  'Customer ID': string;
  'Product Name': string;
  'Category': string;
  'Date': string;
  'Brand': string;
  'Transaction Cost': string;
  'Purchase Type': string;
  'Unit Pack Size': number;
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

export default function ProductRecommendations() {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 60),
    to: new Date(),
  });
  const {
    data: transactions,
    isLoading: transactionsLoading
  } = useQuery({
    queryKey: ['transactions'],
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
  const {
    data: customers,
    isLoading: customersLoading
  } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('fmcg sample customer data').select('*');
      if (error) throw error;
      return data as CustomerData[];
    }
  });
  const {
    data: analytics,
    isLoading: analyticsLoading
  } = useQuery({
    queryKey: ['recommendation-analytics', transactions],
    queryFn: () => calculateRecommendationAnalytics(transactions || []),
    enabled: !!transactions
  });
  const {
    data: customerRecommendations,
    isLoading: recommendationsLoading
  } = useQuery({
    queryKey: ['customer-recommendation', selectedCustomerId, transactions],
    queryFn: () => generateCustomerRecommendations(selectedCustomerId, transactions || [], customers || []),
    enabled: !!selectedCustomerId && !!transactions && !!customers
  });
  const {
    data: predictionAnalytics,
    isLoading: predictionsLoading
  } = useQuery({
    queryKey: ['prediction-analytics', transactions, customers],
    queryFn: () => calculatePredictionAnalytics(transactions || [], customers || []),
    enabled: !!transactions && !!customers
  });
  const {
    data: demographicAnalytics,
    isLoading: demographicLoading
  } = useQuery({
    queryKey: ['demographic-analytics', transactions, customers],
    queryFn: () => calculateDemographicAnalytics(transactions || [], customers || []),
    enabled: !!transactions && !!customers
  });
  const filteredCustomers = customers?.filter(customer => `${customer['First Name']} ${customer['Last Name']}`.toLowerCase().includes(searchTerm.toLowerCase()) || customer['Customer ID'].toLowerCase().includes(searchTerm.toLowerCase())) || [];
  return <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Predictive Analysis</h1>
          <p className="text-muted-foreground">Predictions based on purchase patterns and customer behavior</p>
        </div>
        <DateRangePicker
          date={dateRange}
          onDateChange={setDateRange}
          placeholder="Select analysis period"
        />
      </div>

      {!analyticsLoading && analytics && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transitions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.topTransitions.length}</div>
              <p className="text-xs text-muted-foreground">Product-to-product patterns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Category Affinities</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.categoryAffinities.length}</div>
              <p className="text-xs text-muted-foreground">Cross-category patterns</p>
            </CardContent>
          </Card>
        </div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductPredictions analytics={predictionAnalytics} isLoading={predictionsLoading} />
        <DemographicProductPredictions analytics={demographicAnalytics} isLoading={demographicLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransitionHeatmap analytics={analytics} isLoading={analyticsLoading} />
        <CategoryFlow analytics={analytics} isLoading={analyticsLoading} />
      </div>
    </div>;
}

function calculateRecommendationAnalytics(transactions: TransactionData[]): RecommendationAnalytics {
  const customerTransactions = transactions.reduce((acc, transaction) => {
    const customerId = transaction['Customer ID'];
    if (!acc[customerId]) acc[customerId] = [];
    acc[customerId].push(transaction);
    return acc;
  }, {} as Record<string, TransactionData[]>);
  const transitions: Record<string, Record<string, number>> = {};
  const categoryTransitions: Record<string, Record<string, number>> = {};
  const productCounts: Record<string, number> = {};
  Object.values(customerTransactions).forEach(customerTxns => {
    const sortedTxns = customerTxns.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
    for (let i = 0; i < sortedTxns.length - 1; i++) {
      const currentProduct = sortedTxns[i]['Product Name'];
      const nextProduct = sortedTxns[i + 1]['Product Name'];
      const currentCategory = sortedTxns[i]['Category'];
      const nextCategory = sortedTxns[i + 1]['Category'];
      if (currentProduct && nextProduct && currentProduct !== nextProduct) {
        if (!transitions[currentProduct]) transitions[currentProduct] = {};
        transitions[currentProduct][nextProduct] = (transitions[currentProduct][nextProduct] || 0) + 1;
        if (currentCategory && nextCategory) {
          if (!categoryTransitions[currentCategory]) categoryTransitions[currentCategory] = {};
          categoryTransitions[currentCategory][nextCategory] = (categoryTransitions[currentCategory][nextCategory] || 0) + 1;
        }
      }
    }
    customerTxns.forEach(txn => {
      const product = txn['Product Name'];
      if (product) {
        productCounts[product] = (productCounts[product] || 0) + 1;
      }
    });
  });
  const topTransitions: TransitionMatrix[] = [];
  Object.entries(transitions).forEach(([fromProduct, toProducts]) => {
    const totalTransitions = Object.values(toProducts).reduce((sum, count) => sum + count, 0);
    Object.entries(toProducts).forEach(([toProduct, count]) => {
      topTransitions.push({
        fromProduct,
        toProduct,
        transitionCount: count,
        transitionProbability: count / totalTransitions
      });
    });
  });
  const categoryAffinities = Object.entries(categoryTransitions).flatMap(([fromCategory, toCategories]) => {
    const totalTransitions = Object.values(toCategories).reduce((sum, count) => sum + count, 0);
    return Object.entries(toCategories).map(([toCategory, count]) => ({
      fromCategory,
      toCategory,
      strength: count / totalTransitions
    }));
  }).filter(affinity => affinity.strength > 0.1);
  const popularProducts = Object.entries(productCounts).map(([productName, count]) => {
    const category = transactions.find(t => t['Product Name'] === productName)?.['Category'] || 'Unknown';
    return {
      productName,
      category,
      recommendationCount: count
    };
  }).sort((a, b) => b.recommendationCount - a.recommendationCount).slice(0, 10);
  return {
    topTransitions: topTransitions.sort((a, b) => b.transitionProbability - a.transitionProbability).slice(0, 20),
    categoryAffinities: categoryAffinities.sort((a, b) => b.strength - a.strength),
    popularProducts
  };
}

function generateCustomerRecommendations(customerId: string, transactions: TransactionData[], customers: CustomerData[]): CustomerRecommendation | null {
  const customer = customers.find(c => c['Customer ID'] === customerId);
  if (!customer) return null;
  const customerTransactions = transactions.filter(t => t['Customer ID'] === customerId).sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
  if (customerTransactions.length === 0) return null;
  const customerName = `${customer['First Name']} ${customer['Last Name']}`;
  const lastPurchaseDate = customerTransactions[0].Date;
  const purchaseHistory = customerTransactions.map(t => t['Product Name']).filter(Boolean);
  const recentProducts = purchaseHistory.slice(0, 3);
  const recentCategories = customerTransactions.slice(0, 3).map(t => t['Category']).filter(Boolean);
  const analytics = calculateRecommendationAnalytics(transactions);
  const recommendations: ProductRecommendation[] = [];
  const recommendedProducts = new Set<string>();
  recentProducts.forEach(product => {
    const transitions = analytics.topTransitions.filter(t => t.fromProduct === product);
    transitions.slice(0, 2).forEach(transition => {
      if (!recommendedProducts.has(transition.toProduct) && !purchaseHistory.includes(transition.toProduct)) {
        recommendations.push({
          productId: transition.toProduct,
          productName: transition.toProduct,
          category: transactions.find(t => t['Product Name'] === transition.toProduct)?.['Category'] || 'Unknown',
          confidence: transition.transitionProbability,
          reason: `Customers who bought "${product}" often buy this next`,
          supportingData: {
            transitionProbability: transition.transitionProbability
          }
        });
        recommendedProducts.add(transition.toProduct);
      }
    });
  });
  recentCategories.forEach(category => {
    const affinities = analytics.categoryAffinities.filter(a => a.fromCategory === category);
    affinities.slice(0, 1).forEach(affinity => {
      const categoryProducts = analytics.popularProducts.filter(p => p.category === affinity.toCategory && !purchaseHistory.includes(p.productName) && !recommendedProducts.has(p.productName));
      if (categoryProducts.length > 0) {
        const product = categoryProducts[0];
        recommendations.push({
          productId: product.productName,
          productName: product.productName,
          category: product.category,
          confidence: affinity.strength * 0.8,
          reason: `Popular in ${affinity.toCategory} category, which complements your ${category} purchases`,
          supportingData: {
            categoryAffinity: affinity.strength
          }
        });
        recommendedProducts.add(product.productName);
      }
    });
  });
  if (recommendations.length < 3) {
    analytics.popularProducts.forEach(product => {
      if (recommendations.length < 5 && !purchaseHistory.includes(product.productName) && !recommendedProducts.has(product.productName)) {
        recommendations.push({
          productId: product.productName,
          productName: product.productName,
          category: product.category,
          confidence: 0.3,
          reason: `Popular product in ${product.category} category`,
          supportingData: {
            collaborativeScore: product.recommendationCount / analytics.popularProducts[0].recommendationCount
          }
        });
        recommendedProducts.add(product.productName);
      }
    });
  }
  return {
    customerId,
    customerName,
    lastPurchaseDate,
    recommendations: recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 5),
    purchaseHistory
  };
}

function calculatePredictionAnalytics(transactions: TransactionData[], customers: CustomerData[]): PredictionAnalytics {
  const allProducts = [...new Set(transactions.map(t => t['Product Name']).filter(Boolean))];
  const analytics = calculateRecommendationAnalytics(transactions);
  const productPredictions: ProductPrediction[] = allProducts.map(productName => {
    const customerPredictions: CustomerPrediction[] = [];
    customers.forEach(customer => {
      const customerId = customer['Customer ID'];
      const customerTxns = transactions.filter(t => t['Customer ID'] === customerId).sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
      if (customerTxns.length === 0) return;
      const recentProducts = customerTxns.slice(0, 3).map(t => t['Product Name']).filter(Boolean);
      const purchaseHistory = customerTxns.map(t => t['Product Name']).filter(Boolean);
      if (purchaseHistory.includes(productName)) return;
      let confidence = 0;
      let reasons: string[] = [];
      recentProducts.forEach(recentProduct => {
        const transition = analytics.topTransitions.find(t => t.fromProduct === recentProduct && t.toProduct === productName);
        if (transition) {
          confidence += transition.transitionProbability * 40;
          reasons.push(`Often follows "${recentProduct}"`);
        }
      });
      const recentCategories = customerTxns.slice(0, 3).map(t => t['Category']).filter(Boolean);
      const productCategory = transactions.find(t => t['Product Name'] === productName)?.['Category'];
      if (productCategory) {
        recentCategories.forEach(recentCategory => {
          const affinity = analytics.categoryAffinities.find(a => a.fromCategory === recentCategory && a.toCategory === productCategory);
          if (affinity) {
            confidence += affinity.strength * 30;
            reasons.push(`Category affinity: ${recentCategory} → ${productCategory}`);
          }
        });
      }
      const daysSinceLastPurchase = Math.floor((new Date().getTime() - new Date(customerTxns[0].Date).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLastPurchase <= 30) {
        confidence += (30 - daysSinceLastPurchase) / 30 * 20;
        reasons.push('Recent purchase activity');
      }
      if (customerTxns.length >= 5) {
        confidence += Math.min(customerTxns.length / 10, 1) * 10;
        reasons.push('Frequent buyer');
      }
      if (confidence >= 20) {
        customerPredictions.push({
          customerId,
          customerName: `${customer['First Name']} ${customer['Last Name']}`,
          confidence: Math.round(Math.min(confidence, 100)),
          lastPurchaseDate: customerTxns[0].Date,
          reason: reasons.length > 0 ? reasons.join(', ') : 'Based on purchase patterns'
        });
      }
    });
    customerPredictions.sort((a, b) => b.confidence - a.confidence);
    const category = transactions.find(t => t['Product Name'] === productName)?.['Category'] || 'Unknown';
    return {
      productName,
      category,
      totalPotentialBuyers: customerPredictions.length,
      customerPredictions
    };
  });
  productPredictions.sort((a, b) => b.totalPotentialBuyers - a.totalPotentialBuyers);
  return {
    productPredictions
  };
}

function calculateDemographicAnalytics(transactions: TransactionData[], customers: CustomerData[]): DemographicAnalytics {
  const demographicPurchases: Record<string, Record<string, { count: number; customers: Set<string> }>> = {};
  
  // Initialize demographic categories
  const initDemographic = (key: string) => {
    if (!demographicPurchases[key]) demographicPurchases[key] = {};
  };

  transactions.forEach(transaction => {
    const customer = customers.find(c => c['Customer ID'] === transaction['Customer ID']);
    if (!customer || !transaction['Product Name']) return;

    const productName = transaction['Product Name'];
    const age = customer['Age'];
    const gender = customer['Gender'];
    const location = customer['Local Government'];
    const householdSize = customer['Household Size'];

    // Age groups
    const ageGroup = age ? (
      age <= 25 ? '18-25' :
      age <= 35 ? '26-35' :
      age <= 45 ? '36-45' :
      age <= 55 ? '46-55' : '56+'
    ) : 'Unknown';

    // Household size groups
    const householdGroup = householdSize ? (
      householdSize <= 2 ? '1-2 members' :
      householdSize <= 4 ? '3-4 members' : '5+ members'
    ) : 'Unknown';

    // Track purchases by demographics
    [
      { key: 'age', value: ageGroup },
      { key: 'gender', value: gender || 'Unknown' },
      { key: 'location', value: location || 'Unknown' },
      { key: 'household', value: householdGroup }
    ].forEach(({ key, value }) => {
      initDemographic(key);
      const demographicKey = `${key}:${value}:${productName}`;
      
      if (!demographicPurchases[key][demographicKey]) {
        demographicPurchases[key][demographicKey] = { count: 0, customers: new Set() };
      }
      
      demographicPurchases[key][demographicKey].count++;
      demographicPurchases[key][demographicKey].customers.add(customer['Customer ID']);
    });
  });

  // Calculate predictions for each demographic
  const calculatePredictions = (demographicKey: string) => {
    const predictions: DemographicPrediction[] = [];
    
    Object.entries(demographicPurchases[demographicKey] || {}).forEach(([key, data]) => {
      const [, demographicValue, productName] = key.split(':');
      const category = transactions.find(t => t['Product Name'] === productName)?.['Category'] || 'Unknown';
      
      // Calculate confidence based on purchase frequency and customer count
      const totalCustomers = customers.filter(c => {
        if (demographicKey === 'age') {
          const age = c['Age'];
          const ageGroup = age ? (
            age <= 25 ? '18-25' :
            age <= 35 ? '26-35' :
            age <= 45 ? '36-45' :
            age <= 55 ? '46-55' : '56+'
          ) : 'Unknown';
          return ageGroup === demographicValue;
        } else if (demographicKey === 'gender') {
          return (c['Gender'] || 'Unknown') === demographicValue;
        } else if (demographicKey === 'location') {
          return (c['Local Government'] || 'Unknown') === demographicValue;
        } else if (demographicKey === 'household') {
          const householdSize = c['Household Size'];
          const householdGroup = householdSize ? (
            householdSize <= 2 ? '1-2 members' :
            householdSize <= 4 ? '3-4 members' : '5+ members'
          ) : 'Unknown';
          return householdGroup === demographicValue;
        }
        return false;
      }).length;

      const purchaseRate = totalCustomers > 0 ? (data.customers.size / totalCustomers) * 100 : 0;
      
      if (purchaseRate >= 20 && data.customers.size >= 3) { // Minimum thresholds
        predictions.push({
          demographic: demographicKey,
          value: demographicValue,
          productName,
          category,
          confidence: Math.round(Math.min(purchaseRate, 100)),
          reason: `${Math.round(purchaseRate)}% of ${demographicValue} customers purchase this product`,
          sampleSize: data.customers.size
        });
      }
    });

    return predictions.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
  };

  return {
    agePredictions: calculatePredictions('age'),
    genderPredictions: calculatePredictions('gender'),
    locationPredictions: calculatePredictions('location'),
    householdSizePredictions: calculatePredictions('household')
  };
}
