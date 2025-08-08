import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { CustomerSegment } from "@/types/segmentation";
interface SegmentOverviewProps {
  segments: CustomerSegment[];
}
export const SegmentOverview = ({
  segments
}: SegmentOverviewProps) => {
  const totalCustomers = segments.reduce((sum, segment) => sum + segment.count, 0);
  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Segment Distribution</CardTitle>
          <CardDescription>
            Breakdown of {totalCustomers.toLocaleString()} customers by RFM-Plus segments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={segments} cx="50%" cy="50%" labelLine={false} label={({
                name,
                percentage
              }) => `${name}: ${percentage.toFixed(1)}%`} outerRadius={80} fill="#8884d8" dataKey="count">
                  {segments.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={value => [value, "Customers"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>Top segments and opportunities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {segments.sort((a, b) => b.count - a.count).slice(0, 3).map(segment => <div key={segment.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{segment.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {segment.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{
              width: `${segment.percentage}%`,
              backgroundColor: segment.color
            }} />
                </div>
                <p className="text-xs text-muted-foreground">{segment.description}</p>
              </div>)}
        </CardContent>
      </Card>
    </div>;
};