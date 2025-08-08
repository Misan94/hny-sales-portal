import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RFMData } from "@/types/segmentation";

interface FrequencyDistributionProps {
  data: RFMData[];
}

export const FrequencyDistribution = ({ data }: FrequencyDistributionProps) => {
  // Create bins for Frequency metrics
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

  const frequencyBins = createBins(data.map(d => d.frequency));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequency Distribution</CardTitle>
        <CardDescription>Number of purchases by customer segment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={frequencyBins}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="label" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value, name) => [value, 'Customers']}
                labelFormatter={(label) => `${label} purchases`}
              />
              <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
