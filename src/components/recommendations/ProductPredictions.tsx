
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { PredictionAnalytics } from '@/types/recommendation';
import { Users, Target, TrendingUp, Eye, Package } from 'lucide-react';
import { CustomerPredictionModal } from './CustomerPredictionModal';

interface ProductPredictionsProps {
  analytics: PredictionAnalytics | undefined;
  isLoading: boolean;
}

export function ProductPredictions({ analytics, isLoading }: ProductPredictionsProps) {
  const [selectedProduct, setSelectedProduct] = useState<{
    name: string;
    category: string;
    predictions: any[];
  } | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4 pr-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) return null;

  const getConfidenceLevel = (totalBuyers: number, maxBuyers: number) => {
    const percentage = (totalBuyers / maxBuyers) * 100;
    if (percentage >= 70) return { level: 'High', color: 'bg-green-500', variant: 'default' as const };
    if (percentage >= 40) return { level: 'Medium', color: 'bg-yellow-500', variant: 'secondary' as const };
    return { level: 'Low', color: 'bg-red-500', variant: 'outline' as const };
  };

  const maxBuyers = Math.max(...analytics.productPredictions.map(p => p.totalPotentialBuyers));

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div>Product Purchase Predictions</div>
              <CardDescription className="mt-1">
                AI-powered insights identifying which customers are most likely to purchase each product
              </CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[450px]">
            <div className="space-y-1 p-6">
              {analytics.productPredictions.map((product, index) => {
                const confidence = getConfidenceLevel(product.totalPotentialBuyers, maxBuyers);
                const buyerPercentage = maxBuyers > 0 ? (product.totalPotentialBuyers / maxBuyers) * 100 : 0;
                
                return (
                  <div 
                    key={index} 
                    className="group border rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:border-purple-200 bg-white"
                  >
                    <div className="space-y-4">
                      {/* Product Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Package className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base leading-tight mb-1 line-clamp-2">
                              {product.productName}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                              <Badge variant={confidence.variant} className="text-xs">
                                {confidence.level} Potential
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        {/* Buyer Count Display */}
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-lg font-bold text-purple-600">
                            <Users className="h-5 w-5" />
                            {product.totalPotentialBuyers}
                          </div>
                          <div className="text-xs text-muted-foreground">potential buyers</div>
                        </div>
                      </div>

                      {/* Progress Bar for Relative Comparison */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Market Interest Level</span>
                          <span className="font-medium">{Math.round(buyerPercentage)}%</span>
                        </div>
                        <Progress value={buyerPercentage} className="h-2" />
                      </div>
                      
                      {/* Action Button */}
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-purple-50 group-hover:border-purple-200 transition-colors"
                        onClick={() => setSelectedProduct({
                          name: product.productName,
                          category: product.category,
                          predictions: product.customerPredictions
                        })}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Customer Analysis
                        <TrendingUp className="h-4 w-4 ml-auto opacity-60" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedProduct && (
        <CustomerPredictionModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          productName={selectedProduct.name}
          category={selectedProduct.category}
          customerPredictions={selectedProduct.predictions}
        />
      )}
    </>
  );
}
