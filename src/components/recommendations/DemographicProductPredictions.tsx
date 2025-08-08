
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { DemographicAnalytics, DemographicPrediction } from '@/types/recommendation';
import { Users, MapPin, Home, Calendar, Eye, TrendingUp } from 'lucide-react';
import { DemographicInsightModal } from './DemographicInsightModal';

interface DemographicProductPredictionsProps {
  analytics: DemographicAnalytics | undefined;
  isLoading: boolean;
}

export function DemographicProductPredictions({ analytics, isLoading }: DemographicProductPredictionsProps) {
  const [selectedInsight, setSelectedInsight] = useState<{
    type: string;
    predictions: DemographicPrediction[];
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
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) return null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'bg-green-500';
    if (confidence >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceVariant = (confidence: number): "default" | "secondary" | "outline" => {
    if (confidence >= 70) return 'default';
    if (confidence >= 50) return 'secondary';
    return 'outline';
  };

  const demographicSections = [
    {
      title: 'Age Groups',
      icon: Calendar,
      predictions: analytics.agePredictions.slice(0, 3),
      type: 'age',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Gender',
      icon: Users,
      predictions: analytics.genderPredictions.slice(0, 3),
      type: 'gender',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Location',
      icon: MapPin,
      predictions: analytics.locationPredictions.slice(0, 3),
      type: 'location',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Household Size',
      icon: Home,
      predictions: analytics.householdSizePredictions.slice(0, 3),
      type: 'household',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div>Demographic Purchase Predictions</div>
              <CardDescription className="mt-1">
                AI insights showing purchase patterns based on customer demographics
              </CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[450px]">
            <div className="space-y-6 p-6">
              {demographicSections.map((section) => (
                <div key={section.type} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 ${section.bgColor} rounded-lg`}>
                        <section.icon className={`h-4 w-4 ${section.color}`} />
                      </div>
                      <h3 className="font-semibold text-sm">{section.title}</h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedInsight({
                        type: section.title,
                        predictions: section.predictions
                      })}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View All
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {section.predictions.map((prediction, index) => (
                      <div 
                        key={index}
                        className="border rounded-lg p-3 hover:shadow-sm transition-shadow bg-white"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {prediction.value}
                              </Badge>
                              <Badge variant={getConfidenceVariant(prediction.confidence)} className="text-xs">
                                {prediction.confidence}% confidence
                              </Badge>
                            </div>
                            <h4 className="font-medium text-sm line-clamp-1">
                              {prediction.productName}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {prediction.reason}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Confidence Level</span>
                            <span className="font-medium">{prediction.confidence}%</span>
                          </div>
                          <Progress value={prediction.confidence} className="h-1.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedInsight && (
        <DemographicInsightModal
          isOpen={!!selectedInsight}
          onClose={() => setSelectedInsight(null)}
          type={selectedInsight.type}
          predictions={selectedInsight.predictions}
        />
      )}
    </>
  );
}
