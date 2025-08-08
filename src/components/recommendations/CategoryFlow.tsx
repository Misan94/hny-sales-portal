
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RecommendationAnalytics } from '@/types/recommendation';
import { Package } from 'lucide-react';

interface CategoryFlowProps {
  analytics: RecommendationAnalytics | undefined;
  isLoading: boolean;
}

export function CategoryFlow({ analytics, isLoading }: CategoryFlowProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) return null;

  const topAffinities = analytics.categoryAffinities
    .filter(a => a.fromCategory !== a.toCategory);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Category Affinities
        </CardTitle>
        <CardDescription>
          Cross-category purchase patterns and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[360px]">
          <div className="space-y-3 pr-4">
            {topAffinities.map((affinity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{affinity.fromCategory}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">{affinity.toCategory}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Cross-category affinity
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div 
                      className="bg-secondary h-2 rounded-full" 
                      style={{ width: `${affinity.strength * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-10 text-right">
                    {Math.round(affinity.strength * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
