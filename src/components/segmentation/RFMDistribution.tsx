import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RFMData } from "@/types/segmentation";
interface RFMDistributionProps {
  data: RFMData[];
}
export const RFMDistribution = ({
  data
}: RFMDistributionProps) => {
  // Create bins for RFM metrics
  const createBins = (values: number[], binCount: number = 5) => {
    const sorted = [...values].sort((a, b) => a - b);
    const min = Math.min(...sorted);
    const max = Math.max(...sorted);
    const binSize = (max - min) / binCount;
    const bins = Array.from({
      length: binCount
    }, (_, i) => ({
      label: `${Math.round(min + i * binSize)}-${Math.round(min + (i + 1) * binSize)}`,
      count: 0,
      value: i + 1
    }));
    sorted.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binSize), binCount - 1);
      bins[binIndex].count++;
    });
    return bins;
  };
  const recencyBins = createBins(data.map(d => d.recency));
  const frequencyBins = createBins(data.map(d => d.frequency));
  const monetaryBins = createBins(data.map(d => d.monetary));
  return <Card>
      <CardHeader>
        <CardTitle>RFM Distribution</CardTitle>
        <CardDescription>Distribution of Recency, Frequency, and Monetary values</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Recency (Days since last purchase)</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recencyBins}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Frequency (Number of purchases)</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyBins}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Monetary (Total spend in ₦)</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monetaryBins}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>;
};