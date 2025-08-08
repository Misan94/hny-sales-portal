
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductRecommendation } from '@/types/recommendation';
import { Brain, TrendingUp } from 'lucide-react';

interface RecommendationEngineProps {
  recommendations: ProductRecommendation[];
  isLoading?: boolean;
}

export function RecommendationEngine({ recommendations, isLoading }: RecommendationEngineProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Recommendations
          </CardTitle>
          <CardDescription>Loading personalized recommendations...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Recommendations
          </CardTitle>
          <CardDescription>No recommendations available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a customer to see personalized product recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Recommendations
        </CardTitle>
        <CardDescription>
          Personalized next best product suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{rec.productName}</h3>
                  <Badge variant="outline" className="mt-1">
                    {rec.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <Badge variant={rec.confidence > 0.7 ? "default" : rec.confidence > 0.4 ? "secondary" : "outline"}>
                    {Math.round(rec.confidence * 100)}%
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">{rec.reason}</p>
              
              {rec.supportingData && (
                <div className="flex gap-4 text-xs text-muted-foreground">
                  {rec.supportingData.transitionProbability && (
                    <span>Transition: {Math.round(rec.supportingData.transitionProbability * 100)}%</span>
                  )}
                  {rec.supportingData.categoryAffinity && (
                    <span>Category Affinity: {Math.round(rec.supportingData.categoryAffinity * 100)}%</span>
                  )}
                  {rec.supportingData.collaborativeScore && (
                    <span>Popularity: {Math.round(rec.supportingData.collaborativeScore * 100)}%</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
