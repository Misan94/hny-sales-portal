import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { RFMData } from "@/types/segmentation";
interface PackSizeAnalysisProps {
  data: RFMData[];
}
export const PackSizeAnalysis = ({
  data
}: PackSizeAnalysisProps) => {
  // Pack size preference distribution
  const packSizeDistribution = data.reduce((acc, curr) => {
    acc[curr.packSizePreference] = (acc[curr.packSizePreference] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const packSizeData = Object.entries(packSizeDistribution).map(([name, value]) => ({
    name,
    value,
    color: name === 'Small' ? '#EF4444' : name === 'Medium' ? '#F59E0B' : '#10B981'
  }));

  // Pack size by segment analysis
  const packSizeBySegment = data.reduce((acc, curr) => {
    if (!acc[curr.segment]) {
      acc[curr.segment] = {
        Small: 0,
        Medium: 0,
        Large: 0
      };
    }
    acc[curr.segment][curr.packSizePreference]++;
    return acc;
  }, {} as Record<string, Record<string, number>>);
  const segmentPackData = Object.entries(packSizeBySegment).map(([segment, sizes]) => ({
    segment,
    ...sizes
  }));
  return <Card>
      <CardHeader>
        <CardTitle>Preference Analysis</CardTitle>
        <CardDescription>Customer preferences by pack size and segment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Overall Pack Size Distribution</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={packSizeData} cx="50%" cy="50%" labelLine={false} label={({
                name,
                value
              }) => `${name}: ${value}`} outerRadius={60} fill="#8884d8" dataKey="value">
                  {packSizeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Pack Size by Customer Segment</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={segmentPackData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="segment" fontSize={10} angle={-45} textAnchor="end" height={60} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="Small" stackId="pack" fill="#EF4444" />
                <Bar dataKey="Medium" stackId="pack" fill="#F59E0B" />
                <Bar dataKey="Large" stackId="pack" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>;
};