import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types/product';

export function useProductData() {
  return useQuery({
    queryKey: ['products-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fcmg sample product list')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      return data as Product[];
    }
  });
}

// Helper function to get category performance from real product data
export function getCategoryPerformanceFromProducts(products: Product[]) {
  if (!products || products.length === 0) return [];

  // Group products by category and calculate metrics
  const categoryGroups = products.reduce((acc, product) => {
    const category = product.Category || 'Unknown';
    if (!acc[category]) {
      acc[category] = {
        count: 0,
        totalPrice: 0,
        products: []
      };
    }
    acc[category].count += 1;
    acc[category].products.push(product);
    
    // Parse unit price if available
    const price = product['Unit Price'];
    if (price && typeof price === 'string') {
      const numericPrice = parseFloat(price.replace(/[^\d.]/g, '')) || 0;
      acc[category].totalPrice += numericPrice;
    }
    
    return acc;
  }, {} as Record<string, { count: number; totalPrice: number; products: Product[] }>);

  // Convert to array and calculate percentages
  const totalProducts = products.length;
  const categoryPerformance = Object.entries(categoryGroups)
    .map(([category, data]) => ({
      category,
      share: Math.round((data.count / totalProducts) * 100),
      revenue: Math.round(data.totalPrice * data.count * 100), // Simulated revenue
      growth: Math.floor(Math.random() * 20) + 5, // Random growth for demo
      count: data.count
    }))
    .sort((a, b) => b.share - a.share)
    .slice(0, 5); // Top 5 categories

  return categoryPerformance;
}

// Helper function to get top SKUs for demand pulse
export function getTopSKUsFromProducts(products: Product[]) {
  if (!products || products.length === 0) return [];

  // Get a mix of products from different categories
  const topSKUs = products
    .filter(p => p['Product Name'] && p.Brand && p.Category)
    .slice(0, 4)
    .map((product, index) => {
      const locations = ['Lagos', 'Abuja', 'Kano', 'Port Harcourt'];
      const velocities = ['High', 'High', 'Medium', 'High'];
      const values = ['₦2.4M', '₦1.8M', '₦1.2M', '₦980K'];
      const daysOnHand = [2.1, 1.8, 3.2, 2.5];
      
      return {
        sku: product['Product Name'],
        value: values[index] || '₦500K',
        location: locations[index] || 'Lagos',
        velocity: velocities[index] || 'Medium',
        daysOnHand: daysOnHand[index] || 2.0
      };
    });

  return topSKUs;
}

// Helper function to get price elasticity data from real products
export function getPriceElasticityFromProducts(products: Product[]) {
  if (!products || products.length === 0) return [];

  // Get first 3 products with valid pricing data
  const elasticityData = products
    .filter(p => p['Product Name'] && p['Unit Price'])
    .slice(0, 3)
    .map((product, index) => {
      // Parse current price from the product data
      const currentPriceStr = product['Unit Price'] || '0';
      const currentPrice = parseFloat(currentPriceStr.replace(/[^\d.]/g, '')) || 100;
      
      // Generate mock optimal price and elasticity data
      const priceAdjustments = [1.12, 0.92, 1.06]; // +12%, -8%, +6%
      const elasticities = [-1.2, -2.1, -0.8];
      const demandChanges = ['+15%', '-8%', '+12%'];
      
      return {
        sku: product['Product Name'],
        currentPrice: Math.round(currentPrice),
        optimalPrice: Math.round(currentPrice * priceAdjustments[index]),
        elasticity: elasticities[index],
        demandChange: demandChanges[index]
      };
    });

  return elasticityData;
}

// Helper function to get cross-sell matrix from real products
export function getCrossSellMatrixFromProducts(products: Product[]) {
  if (!products || products.length === 0) return [];

  // Get products for cross-sell pairs
  const validProducts = products.filter(p => p['Product Name'] && p.Brand);
  
  if (validProducts.length < 6) return [];

  const crossSellData = [];
  
  // Create pairs from available products
  for (let i = 0; i < Math.min(3, Math.floor(validProducts.length / 2)); i++) {
    const primaryProduct = validProducts[i * 2];
    const recommendedProduct = validProducts[i * 2 + 1];
    
    const coIndices = [0.78, 0.65, 0.71];
    const uplifts = ['+32%', '+28%', '+25%'];
    
    crossSellData.push({
      primaryProduct: primaryProduct['Product Name'],
      recommendedProduct: recommendedProduct['Product Name'],
      coIndex: coIndices[i] || 0.6,
      uplift: uplifts[i] || '+20%'
    });
  }

  return crossSellData;
}
