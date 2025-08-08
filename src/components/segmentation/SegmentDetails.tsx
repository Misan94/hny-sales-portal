import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomerSegment, RFMData } from "@/types/segmentation";
interface SegmentDetailsProps {
  segments: CustomerSegment[];
  rfmData: RFMData[];
}
export const SegmentDetails = ({
  segments,
  rfmData
}: SegmentDetailsProps) => {
  const getSegmentRecommendation = (segmentName: string) => {
    const recommendations = {
      'Champions': {
        action: 'VIP Program',
        description: 'Offer exclusive products, early access, and premium service',
        priority: 'high' as const
      },
      'Loyal Customers': {
        action: 'Loyalty Rewards',
        description: 'Implement points system and referral bonuses',
        priority: 'high' as const
      },
      'Potential Loyalists': {
        action: 'Engagement Campaign',
        description: 'Send personalized offers and product recommendations',
        priority: 'medium' as const
      },
      'New Customers': {
        action: 'Onboarding Series',
        description: 'Welcome campaign with trial packs and tutorials',
        priority: 'medium' as const
      },
      'At Risk': {
        action: 'Win-back Campaign',
        description: 'Special discounts and "we miss you" messaging',
        priority: 'high' as const
      },
      'Cannot Lose Them': {
        action: 'Urgent Retention',
        description: 'Personal outreach and exclusive retention offers',
        priority: 'high' as const
      },
      'Price Sensitive': {
        action: 'Value Promotions',
        description: 'Focus on small pack deals and bundle offers',
        priority: 'medium' as const
      },
      'Bulk Buyers': {
        action: 'Volume Discounts',
        description: 'Bulk purchase incentives and wholesale pricing',
        priority: 'medium' as const
      },
      'Others': {
        action: 'General Marketing',
        description: 'Include in general promotional campaigns',
        priority: 'low' as const
      }
    };
    return recommendations[segmentName] || recommendations['Others'];
  };
  const getSegmentMetrics = (segmentName: string) => {
    const segmentData = rfmData.filter(d => d.segment === segmentName);
    if (segmentData.length === 0) return null;
    const avgRecency = segmentData.reduce((sum, d) => sum + d.recency, 0) / segmentData.length;
    const avgFrequency = segmentData.reduce((sum, d) => sum + d.frequency, 0) / segmentData.length;
    const avgMonetary = segmentData.reduce((sum, d) => sum + d.monetary, 0) / segmentData.length;
    return {
      avgRecency: Math.round(avgRecency),
      avgFrequency: Math.round(avgFrequency * 10) / 10,
      avgMonetary: Math.round(avgMonetary)
    };
  };
  return <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
        <CardDescription>
          Recommended actions and metrics for each customer segment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Segment</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Avg Recency</TableHead>
              <TableHead>Avg Frequency</TableHead>
              <TableHead>Avg Spend</TableHead>
              <TableHead>Recommended Action</TableHead>
              <TableHead>Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {segments.sort((a, b) => b.count - a.count).map(segment => {
            const recommendation = getSegmentRecommendation(segment.name);
            const metrics = getSegmentMetrics(segment.name);
            return <TableRow key={segment.name}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{
                    backgroundColor: segment.color
                  }} />
                        <span className="font-medium">{segment.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{segment.count.toLocaleString()}</TableCell>
                    <TableCell>{metrics ? `${metrics.avgRecency} days` : '-'}</TableCell>
                    <TableCell>{metrics ? `${metrics.avgFrequency}x` : '-'}</TableCell>
                    <TableCell>{metrics ? `₦${metrics.avgMonetary.toLocaleString()}` : '-'}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{recommendation.action}</div>
                        <div className="text-xs text-muted-foreground">
                          {recommendation.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={recommendation.priority === 'high' ? 'destructive' : recommendation.priority === 'medium' ? 'default' : 'secondary'}>
                        {recommendation.priority}
                      </Badge>
                    </TableCell>
                  </TableRow>;
          })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>;
};