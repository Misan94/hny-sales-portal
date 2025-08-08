
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RecommendationAnalytics } from '@/types/recommendation';
import { TrendingUp } from 'lucide-react';

interface TransitionHeatmapProps {
  analytics: RecommendationAnalytics | undefined;
  isLoading: boolean;
}

export function TransitionHeatmap({ analytics, isLoading }: TransitionHeatmapProps) {
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

  const topTransitions = analytics.topTransitions;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Product Transitions
        </CardTitle>
        <CardDescription>
          Most common product-to-product purchase patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[360px]">
          <div className="space-y-3 pr-4">
            {topTransitions.map((transition, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium truncate max-w-[120px]" title={transition.fromProduct}>
                      {transition.fromProduct}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium truncate max-w-[120px]" title={transition.toProduct}>
                      {transition.toProduct}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {transition.transitionCount} transitions
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${transition.transitionProbability * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-10 text-right">
                    {Math.round(transition.transitionProbability * 100)}%
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
