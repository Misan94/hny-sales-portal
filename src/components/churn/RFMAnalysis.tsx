import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, HeatMapGrid } from 'recharts';
import { CustomerChurnData } from '@/types/churn';

interface RFMAnalysisProps {
  customers: CustomerChurnData[];
  isLoading: boolean;
}

interface RFMSegment {
  segment: string;
  description: string;
  count: number;
  avgChurnScore: number;
  characteristics: string[];
  priority: 'high' | 'medium' | 'low';
}

export function RFMAnalysis({ customers, isLoading }: RFMAnalysisProps) {
  if (isLoading || !customers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>RFM Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading RFM analysis...</div>
        </CardContent>
      </Card>
    );
  }

  const rfmSegments = calculateRFMSegments(customers);
  const scatterData = customers.map(customer => ({
    recency: customer.recencyScore,
    frequency: customer.frequencyScore,
    monetary: customer.monetaryScore,
    churnScore: customer.churnScore,
    name: customer.customerName
  }));

  return (
    <div className="space-y-6">
      {/* RFM Segments Overview */}
      <Card>
        <CardHeader>
          <CardTitle>RFM Customer Segments</CardTitle>
          <CardDescription>
            Customer segmentation based on Recency, Frequency, and Monetary value
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rfmSegments.map((segment, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{segment.segment}</h4>
                  <Badge variant={
                    segment.priority === 'high' ? 'destructive' :
                    segment.priority === 'medium' ? 'default' : 'secondary'
                  }>
                    {segment.priority} priority
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">{segment.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Customers: {segment.count}</span>
                  <span className={`font-medium ${
                    segment.avgChurnScore >= 60 ? 'text-red-600' :
                    segment.avgChurnScore >= 40 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    Avg Churn: {segment.avgChurnScore.toFixed(1)}
                  </span>
                </div>

                <div className="space-y-1">
                  {segment.characteristics.map((char, charIndex) => (
                    <div key={charIndex} className="text-xs text-muted-foreground">
                      • {char}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* RFM Scatter Plot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recency vs Frequency</CardTitle>
            <CardDescription>Customer positioning by purchase recency and frequency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={scatterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="recency" name="Recency Score" />
                  <YAxis dataKey="frequency" name="Frequency Score" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p>Recency: {data.recency}/5</p>
                            <p>Frequency: {data.frequency}/5</p>
                            <p>Churn Score: {data.churnScore}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="churnScore" fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequency vs Monetary</CardTitle>
            <CardDescription>Customer value by purchase frequency and spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={scatterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="frequency" name="Frequency Score" />
                  <YAxis dataKey="monetary" name="Monetary Score" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p>Frequency: {data.frequency}/5</p>
                            <p>Monetary: {data.monetary}/5</p>
                            <p>Churn Score: {data.churnScore}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="churnScore" fill="#82ca9d" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function calculateRFMSegments(customers: CustomerChurnData[]): RFMSegment[] {
  const segments: RFMSegment[] = [];

  // Define RFM segments based on score combinations
  const segmentDefinitions = [
    {
      name: 'Champions',
      condition: (c: CustomerChurnData) => c.recencyScore >= 4 && c.frequencyScore >= 4 && c.monetaryScore >= 4,
      description: 'Best customers with recent, frequent, and high-value purchases',
      priority: 'low' as const,
      characteristics: ['Recent purchasers', 'High frequency', 'High spenders', 'Lowest churn risk']
    },
    {
      name: 'Loyal Customers',
      condition: (c: CustomerChurnData) => c.recencyScore >= 3 && c.frequencyScore >= 4 && c.monetaryScore >= 3,
      description: 'Regular customers with good purchase patterns',
      priority: 'low' as const,
      characteristics: ['Regular buyers', 'Consistent spending', 'Good retention']
    },
    {
      name: 'Potential Loyalists',
      condition: (c: CustomerChurnData) => c.recencyScore >= 4 && c.frequencyScore >= 2 && c.frequencyScore <= 3,
      description: 'Recent customers with growth potential',
      priority: 'medium' as const,
      characteristics: ['Recent engagement', 'Moderate frequency', 'Growth opportunity']
    },
    {
      name: 'At Risk',
      condition: (c: CustomerChurnData) => c.recencyScore <= 2 && c.frequencyScore >= 3 && c.monetaryScore >= 3,
      description: 'Previously good customers who haven\'t purchased recently',
      priority: 'high' as const,
      characteristics: ['Declining recency', 'Previously loyal', 'High churn risk']
    },
    {
      name: 'Cannot Lose Them',
      condition: (c: CustomerChurnData) => c.recencyScore <= 2 && c.frequencyScore >= 4 && c.monetaryScore >= 4,
      description: 'High-value customers at risk of churning',
      priority: 'high' as const,
      characteristics: ['High value', 'Previously frequent', 'Critical retention']
    },
    {
      name: 'Hibernating',
      condition: (c: CustomerChurnData) => c.recencyScore <= 2 && c.frequencyScore <= 2 && c.monetaryScore >= 3,
      description: 'Inactive customers with previous value',
      priority: 'medium' as const,
      characteristics: ['Long inactive', 'Previous spenders', 'Re-engagement needed']
    },
    {
      name: 'Lost',
      condition: (c: CustomerChurnData) => c.recencyScore <= 2 && c.frequencyScore <= 2 && c.monetaryScore <= 2,
      description: 'Customers who have likely churned',
      priority: 'low' as const,
      characteristics: ['Long inactive', 'Low historical value', 'Likely churned']
    }
  ];

  // Classify customers into segments
  segmentDefinitions.forEach(segmentDef => {
    const segmentCustomers = customers.filter(segmentDef.condition);
    
    if (segmentCustomers.length > 0) {
      const avgChurnScore = segmentCustomers.reduce((sum, c) => sum + c.churnScore, 0) / segmentCustomers.length;
      
      segments.push({
        segment: segmentDef.name,
        description: segmentDef.description,
        count: segmentCustomers.length,
        avgChurnScore,
        characteristics: segmentDef.characteristics,
        priority: segmentDef.priority
      });
    }
  });

  // Add "Others" segment for customers not fitting defined segments
  const classifiedCount = segments.reduce((sum, s) => sum + s.count, 0);
  if (classifiedCount < customers.length) {
    const otherCustomers = customers.length - classifiedCount;
    const remainingCustomers = customers.slice(classifiedCount);
    const avgChurnScore = remainingCustomers.reduce((sum, c) => sum + c.churnScore, 0) / remainingCustomers.length;
    
    segments.push({
      segment: 'Others',
      description: 'Customers with mixed RFM patterns',
      count: otherCustomers,
      avgChurnScore,
      characteristics: ['Mixed patterns', 'Needs individual analysis'],
      priority: 'medium'
    });
  }

  return segments.sort((a, b) => b.count - a.count);
}
