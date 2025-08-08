import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Target, ArrowRight, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PredictiveAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PredictiveAnalysisModal({ isOpen, onClose }: PredictiveAnalysisModalProps) {
  const navigate = useNavigate();

  // Mock predictive analysis summary data
  const analysisData = {
    totalCustomers: 2847,
    analysisDate: new Date().toLocaleDateString(),
    processingTime: '2.3 seconds',
    accuracy: 94.2,
    topPredictions: [
      {
        product: 'Honeywell Semolina 1kg',
        category: 'Ball Foods',
        potentialBuyers: 342,
        confidence: 87,
        estimatedRevenue: 1840000
      },
      {
        product: 'Golden Pasta Macaroni 500g',
        category: 'Pasta',
        potentialBuyers: 298,
        confidence: 82,
        estimatedRevenue: 1290000
      },
      {
        product: 'Premium Noodles 150g',
        category: 'Noodles',
        potentialBuyers: 267,
        confidence: 79,
        estimatedRevenue: 980000
      }
    ],
    demographicInsights: [
      { segment: 'Age 26-35', likelihood: 68, revenue: 2450000 },
      { segment: 'Household 3-4 members', likelihood: 61, revenue: 1890000 },
      { segment: 'Lagos Mainland', likelihood: 58, revenue: 1620000 }
    ],
    keyInsights: [
      'Young families (26-35) show highest purchase intent for new products',
      'Medium household sizes prefer bulk purchasing options',
      'Lagos Mainland region presents strongest growth opportunity',
      'Cross-selling potential identified in Ball Foods category'
    ]
  };

  const handleViewFullReport = () => {
    onClose();
    navigate('/predictive-analysis');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <DialogTitle className="text-xl">Predictive Analysis Report</DialogTitle>
          </div>
          <DialogDescription>
            AI-powered customer behavior predictions and purchase recommendations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Analysis Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Analysis Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analysisData.totalCustomers.toLocaleString()}</div>
                  <div className="text-sm text-blue-700">Customers Analyzed</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{analysisData.accuracy}%</div>
                  <div className="text-sm text-green-700">Model Accuracy</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{analysisData.processingTime}</div>
                  <div className="text-sm text-purple-700">Processing Time</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{analysisData.analysisDate}</div>
                  <div className="text-sm text-orange-700">Analysis Date</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Product Predictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                Top Product Predictions
              </CardTitle>
              <CardDescription>Products with highest purchase probability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.topPredictions.map((prediction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-semibold">{prediction.product}</div>
                      <div className="text-sm text-muted-foreground">{prediction.category}</div>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {prediction.potentialBuyers} potential buyers
                        </span>
                        <span className="text-green-600 font-medium">
                          ₦{(prediction.estimatedRevenue / 1000000).toFixed(1)}M revenue
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="default" className="mb-2">
                        {prediction.confidence}% confidence
                      </Badge>
                      <Progress value={prediction.confidence} className="w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Demographic Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Demographic Insights
              </CardTitle>
              <CardDescription>Customer segments with highest purchase likelihood</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysisData.demographicInsights.map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="font-semibold mb-2">{insight.segment}</div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Purchase Likelihood</span>
                      <Badge variant="outline">{insight.likelihood}%</Badge>
                    </div>
                    <Progress value={insight.likelihood} className="mb-2" />
                    <div className="text-sm text-green-600 font-medium">
                      ₦{(insight.revenue / 1000000).toFixed(1)}M potential revenue
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Key Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisData.keyInsights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-sm text-amber-800">{insight}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleViewFullReport} className="flex-1">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Full Report
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close Summary
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
