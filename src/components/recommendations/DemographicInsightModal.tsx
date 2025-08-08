
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DemographicPrediction } from '@/types/recommendation';
import { Users, TrendingUp } from 'lucide-react';

interface DemographicInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  predictions: DemographicPrediction[];
}

export function DemographicInsightModal({ 
  isOpen, 
  onClose, 
  type, 
  predictions 
}: DemographicInsightModalProps) {
  const getConfidenceVariant = (confidence: number): "default" | "secondary" | "outline" => {
    if (confidence >= 70) return 'default';
    if (confidence >= 50) return 'secondary';
    return 'outline';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {type} Purchase Predictions
          </DialogTitle>
          <DialogDescription>
            Detailed analysis of purchase patterns for {type.toLowerCase()} demographics
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <div 
                key={index}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">
                        {prediction.demographic}: {prediction.value}
                      </Badge>
                      <Badge variant={getConfidenceVariant(prediction.confidence)}>
                        {prediction.confidence}% confidence
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold mb-1">{prediction.productName}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Category: {prediction.category}
                    </p>
                    <p className="text-sm">{prediction.reason}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prediction Confidence</span>
                    <span className="font-medium">{prediction.confidence}%</span>
                  </div>
                  <Progress value={prediction.confidence} className="h-2" />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Sample size: {prediction.sampleSize} customers</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Statistical significance
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
