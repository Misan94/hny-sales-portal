
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
      <div className="space-y-3 sm:space-y-4">
        {paginatedCustomers.map((customer) => (
          <Card key={customer.customerId} className="p-3 sm:p-4">
            <CardContent className="p-0 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">{customer.customerName}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">ID: {customer.customerId}</p>
                </div>
                <div className="flex items-center gap-3 sm:text-right">
                  <div className={`text-xl sm:text-2xl font-bold ${getRiskTextColor(customer.riskLevel)}`}>
                    {customer.churnScore}
                  </div>
                  <Badge variant={getRiskColor(customer.riskLevel)} className="text-xs">
                    {customer.riskLevel} Risk
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-muted-foreground">Last Purchase:</span>
                  <div className="font-medium">{customer.daysSinceLastPurchase} days ago</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Purchases:</span>
                  <div className="font-medium">{customer.totalPurchases}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Spent:</span>
                  <div className="font-medium">₦{customer.totalSpent.toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-muted-foreground">Recency Score:</span>
                  <div className={`font-medium ${customer.recencyScore <= 2 ? 'text-red-600' : 'text-green-600'}`}>
                    {customer.recencyScore}/5
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Frequency Score:</span>
                  <div className={`font-medium ${customer.frequencyScore <= 2 ? 'text-red-600' : 'text-green-600'}`}>
                    {customer.frequencyScore}/5
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Monetary Score:</span>
                  <div className={`font-medium ${customer.monetaryScore <= 2 ? 'text-red-600' : 'text-green-600'}`}>
                    {customer.monetaryScore}/5
                  </div>
                </div>
              </div>

              {customer.interventionRecommendations.length > 0 && (
                <div>
                  <span className="text-xs sm:text-sm text-muted-foreground">Recommended Actions:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {customer.interventionRecommendations.map((recommendation, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {recommendation}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
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
