import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RFMData } from "@/types/segmentation";

interface MonetaryDistributionProps {
  data: RFMData[];
}

export const MonetaryDistribution = ({ data }: MonetaryDistributionProps) => {
  // Create bins for Monetary metrics
  const createBins = (values: number[], binCount: number = 5) => {
    const sorted = [...values].sort((a, b) => a - b);
    const min = Math.min(...sorted);
    const max = Math.max(...sorted);
    const binSize = (max - min) / binCount;

    const bins = Array.from({
      length: binCount
    }, (_, i) => ({
      label: `₦${(min + i * binSize).toLocaleString(undefined, { maximumFractionDigits: 0 })}-₦${(min + (i + 1) * binSize).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      count: 0,
      value: i + 1
    }));

    sorted.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binSize), binCount - 1);
      bins[binIndex].count++;
    });

    return bins;
  };

  const monetaryBins = createBins(data.map(d => d.monetary));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monetary Distribution</CardTitle>
        <CardDescription>Total spend in ₦ by customer segment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monetaryBins}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="label" 
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value, name) => [value, 'Customers']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
