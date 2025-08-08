import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users } from "lucide-react";

interface CustomerData {
  age: number;
  gender: string;
  totalSpend: number;
  transactionCount: number;
  customerId: string;
}

interface AgeGenderScatterPlotProps {
  data?: any; // We'll generate our own data for now
}

export function AgeGenderScatterPlot({ data }: AgeGenderScatterPlotProps) {
  // Generate mock customer data for age-gender analysis
  const generateCustomerData = (): CustomerData[] => {
    const genders = ['Male', 'Female'];
    const customers: CustomerData[] = [];
    
    // Generate 100 customers with realistic age and spending patterns
    for (let i = 0; i < 100; i++) {
      const age = Math.floor(Math.random() * 50) + 18; // Ages 18-68
      const gender = genders[Math.floor(Math.random() * genders.length)];
      
      // Spending tends to increase with age up to a point, with some variation
      let baseSpend = 5000;
      if (age >= 25 && age <= 45) baseSpend = 15000; // Peak earning years
      else if (age > 45 && age <= 60) baseSpend = 20000; // Higher disposable income
      else if (age > 60) baseSpend = 12000; // Retirement, more careful spending
      
      const totalSpend = baseSpend + (Math.random() * 10000 - 5000); // Add variation
      const transactionCount = Math.floor(Math.random() * 15) + 1;
      
      customers.push({
        age,
        gender,
        totalSpend: Math.max(1000, totalSpend), // Minimum spend
        transactionCount,
        customerId: `CUST${i + 1}`
      });
    }
    
    return customers;
  };

  const customerData = generateCustomerData();
  
  // Separate data by gender for different scatter series
  const maleCustomers = customerData
    .filter(customer => customer.gender === 'Male')
    .map(customer => ({
      age: customer.age,
      totalSpend: customer.totalSpend,
      transactionCount: customer.transactionCount,
      customerId: customer.customerId
    }));
    
  const femaleCustomers = customerData
    .filter(customer => customer.gender === 'Female')
    .map(customer => ({
      age: customer.age,
      totalSpend: customer.totalSpend,
      transactionCount: customer.transactionCount,
      customerId: customer.customerId
    }));

  // Calculate summary statistics
  const avgMaleSpend = Math.round(maleCustomers.reduce((sum, c) => sum + c.totalSpend, 0) / maleCustomers.length);
  const avgFemaleSpend = Math.round(femaleCustomers.reduce((sum, c) => sum + c.totalSpend, 0) / femaleCustomers.length);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Age-Gender Purchase Analysis
        </CardTitle>
        <CardDescription>
          Customer spending patterns by age and gender demographics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-900">₦{avgMaleSpend.toLocaleString()}</div>
              <div className="text-sm text-blue-700">Avg Male Spend</div>
            </div>
            <div className="text-center p-3 bg-pink-50 rounded-lg">
              <div className="text-lg font-semibold text-pink-900">₦{avgFemaleSpend.toLocaleString()}</div>
              <div className="text-sm text-pink-700">Avg Female Spend</div>
            </div>
          </div>

          {/* Scatter Plot */}
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="age" 
                  name="Age" 
                  domain={[15, 70]}
                  tickCount={6}
                />
                <YAxis 
                  type="number" 
                  dataKey="totalSpend" 
                  name="Total Spend" 
                  tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value: any, name: string) => {
                    if (name === 'totalSpend') {
                      return [`₦${value.toLocaleString()}`, 'Total Spend'];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(value) => `Age: ${value}`}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg">
                          <p className="font-medium">Customer Analysis</p>
                          <p>Age: {data.age} years</p>
                          <p>Total Spend: ₦{data.totalSpend.toLocaleString()}</p>
                          <p>Transactions: {data.transactionCount}</p>
                          <p>Gender: {payload[0].name === 'Male' ? 'Male' : 'Female'}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Scatter 
                  name="Male" 
                  data={maleCustomers} 
                  fill="#3b82f6"
                  fillOpacity={0.7}
                />
                <Scatter 
                  name="Female" 
                  data={femaleCustomers} 
                  fill="#ec4899"
                  fillOpacity={0.7}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-sm mb-1">Peak Spending Age</div>
              <div className="text-xs text-muted-foreground">
                Ages 45-60 show highest average spending across both genders
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-sm mb-1">Gender Distribution</div>
              <div className="text-xs text-muted-foreground">
                {maleCustomers.length} male, {femaleCustomers.length} female customers analyzed
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
