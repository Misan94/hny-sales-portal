
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CustomerChurnData, ChurnRiskLevel } from '@/types/churn';
import { CustomerPagination } from '@/components/CustomerPagination';

interface CustomerRiskListProps {
  customers: CustomerChurnData[];
  isLoading: boolean;
}

const getRiskColor = (riskLevel: ChurnRiskLevel) => {
  switch (riskLevel) {
    case 'Critical': return 'destructive';
    case 'High': return 'secondary';
    case 'Medium': return 'outline';
    case 'Low': return 'default';
  }
};

const getRiskTextColor = (riskLevel: ChurnRiskLevel) => {
  switch (riskLevel) {
    case 'Critical': return 'text-red-600';
    case 'High': return 'text-orange-600';
    case 'Medium': return 'text-yellow-600';
    case 'Low': return 'text-green-600';
  }
};

export function CustomerRiskList({ customers, isLoading }: CustomerRiskListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (isLoading) {
    return <div className="text-center text-muted-foreground text-sm sm:text-base">Loading customers...</div>;
  }

  if (customers.length === 0) {
    return <div className="text-center text-muted-foreground text-sm sm:text-base">No customers found for the selected risk level.</div>;
  }

  const totalPages = Math.ceil(customers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedCustomers = customers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-medium">Customer</th>
              <th className="text-center p-3 font-medium">Churn Score</th>
              <th className="text-center p-3 font-medium">Risk Level</th>
              <th className="text-right p-3 font-medium">Last Purchase</th>
              <th className="text-right p-3 font-medium">Purchases</th>
              <th className="text-right p-3 font-medium">Total Spent</th>
              <th className="text-center p-3 font-medium">RFM Scores</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((customer) => (
              <tr key={customer.customerId} className="border-b hover:bg-muted/50">
                <td className="p-3">
                  <div>
                    <div className="font-medium">{customer.customerName}</div>
                    <div className="text-xs text-muted-foreground">ID: {customer.customerId}</div>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className={`text-lg font-bold ${getRiskTextColor(customer.riskLevel)}`}>
                    {customer.churnScore}
                  </div>
                </td>
                <td className="p-3 text-center">
                  <Badge variant={getRiskColor(customer.riskLevel)} className="text-xs">
                    {customer.riskLevel}
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <div className="font-medium">{customer.daysSinceLastPurchase} days ago</div>
                </td>
                <td className="p-3 text-right">
                  <div className="font-medium">{customer.totalPurchases}</div>
                </td>
                <td className="p-3 text-right">
                  <div className="font-medium">₦{customer.totalSpent.toLocaleString()}</div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-1">
                    <span className={`px-1 py-0.5 rounded text-xs ${customer.recencyScore <= 2 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      R:{customer.recencyScore}
                    </span>
                    <span className={`px-1 py-0.5 rounded text-xs ${customer.frequencyScore <= 2 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      F:{customer.frequencyScore}
                    </span>
                    <span className={`px-1 py-0.5 rounded text-xs ${customer.monetaryScore <= 2 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      M:{customer.monetaryScore}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {customer.interventionRecommendations.slice(0, 2).map((recommendation, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {recommendation.length > 15 ? recommendation.substring(0, 15) + '...' : recommendation}
                      </Badge>
                    ))}
                    {customer.interventionRecommendations.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{customer.interventionRecommendations.length - 2} more
                      </Badge>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CustomerPagination
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalRecords={customers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  );
}
