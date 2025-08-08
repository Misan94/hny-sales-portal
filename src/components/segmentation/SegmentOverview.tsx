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
  return <div className="w-full">
      <Card>
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
    </div>;
};