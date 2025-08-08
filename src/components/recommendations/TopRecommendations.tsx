
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { RecommendationAnalytics } from '@/types/recommendation';
import { Star } from 'lucide-react';

interface TopRecommendationsProps {
  analytics: RecommendationAnalytics | undefined;
  isLoading: boolean;
}

export function TopRecommendations({ analytics, isLoading }: TopRecommendationsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Most Recommended Products
        </CardTitle>
        <CardDescription>
          Products with highest recommendation potential across all customers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.popularProducts.slice(0, 6).map((product, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-sm leading-tight">{product.productName}</h3>
                <Badge variant="secondary" className="text-xs">
                  #{index + 1}
                </Badge>
              </div>
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
              <div className="text-xs text-muted-foreground">
                {product.recommendationCount} recommendations
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
