import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
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
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={segments} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value, "Customers"]}
                  labelFormatter={(label) => `Segment: ${label}`}
                />
                <Legend />
                <Bar dataKey="count" fill="#8884d8">
                  {segments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>;
};