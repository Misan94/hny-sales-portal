
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomerPagination } from "@/components/CustomerPagination";
import { MobileTable } from "@/components/MobileTable";
import { Search, ShoppingCart } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import type { Transaction } from "@/types/transaction";

const CustomerPurchases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  
  const {
    data: transactions = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      console.log('🔄 Fetching transactions from Supabase...');
      const startTime = performance.now();
      
      const {
        data,
        error,
        count
      } = await supabase
        .from('fmcg sample transaction data')
        .select('*', { count: 'exact' })
        .order('Transaction ID', { ascending: true });
      
      const endTime = performance.now();
      
      if (error) {
        console.error('❌ Error fetching transactions:', error);
        console.error('Error details:', { message: error.message, hint: error.hint, code: error.code });
        throw error;
      }
      
      // Enhanced logging for data integrity
      console.log('✅ Successfully fetched transactions');
      console.log(`📊 Data Stats:`, {
        totalRecords: count,
        fetchedRecords: data?.length || 0,
        fetchTime: `${(endTime - startTime).toFixed(2)}ms`,
        firstRecord: data?.[0],
        lastRecord: data?.[data?.length - 1]
      });
      
      // Validate data structure
      if (data && data.length > 0) {
        const sampleRecord = data[0];
        const expectedFields = ['Transaction ID', 'Customer ID', 'Product Name', 'Brand', 'Category', 'Purchase Type', 'Date', 'Transaction Cost', 'Unit Pack Size'];
        const missingFields = expectedFields.filter(field => !(field in sampleRecord));
        
        if (missingFields.length > 0) {
          console.warn('⚠️ Missing expected fields in data:', missingFields);
        }
        
        console.log('📋 Sample record structure:', Object.keys(sampleRecord));
      }
      
      return data as Transaction[];
    }
  });

  // Reset to first page when search term or rows per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, rowsPerPage]);

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => 
    transaction["Transaction ID"]?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    transaction["Customer ID"]?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    transaction["Product Name"]?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    transaction.Brand?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    transaction.Category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalRecords = filteredTransactions.length;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
  };
  
  const mobileFields = [
    { key: "Transaction ID", label: "Transaction ID" }, 
    { key: "Customer ID", label: "Customer ID" }, 
    { key: "Product Name", label: "Product Name" }, 
    { key: "Brand", label: "Brand" }, 
    { key: "Category", label: "Category" }, 
    { key: "Purchase Type", label: "Purchase Type" }, 
    { key: "Date", label: "Date" }, 
    { key: "Transaction Cost", label: "Transaction Cost" }, 
    { key: "Unit Pack Size", label: "Unit Pack Size" }
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Customer Purchases</h2>
            <p className="text-muted-foreground">
              Manage and view customer transaction data
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-500">Error loading transactions: {error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Purchases</h2>
          <p className="text-muted-foreground">View all customer purchases</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <ShoppingCart className="h-4 w-4" />
          <span>{totalRecords} transactions</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search transactions..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="pl-10" 
            />
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <p className="text-muted-foreground text-sm sm:text-base">Loading transactions...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden sm:block rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Transaction ID</TableHead>
                      <TableHead className="min-w-[120px]">Customer ID</TableHead>
                      <TableHead className="min-w-[200px]">Product Name</TableHead>
                      <TableHead className="min-w-[120px]">Brand</TableHead>
                      <TableHead className="min-w-[120px]">Category</TableHead>
                      <TableHead className="min-w-[120px]">Purchase Type</TableHead>
                      <TableHead className="min-w-[100px]">Date</TableHead>
                      <TableHead className="min-w-[120px]">Transaction Cost</TableHead>
                      <TableHead className="min-w-[120px]">Unit Pack Size</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTransactions.length > 0 ? (
                      currentTransactions.map(transaction => (
                        <TableRow key={transaction["Transaction ID"]}>
                          <TableCell className="font-medium">
                            {transaction["Transaction ID"]}
                          </TableCell>
                          <TableCell>{transaction["Customer ID"] || "N/A"}</TableCell>
                          <TableCell>{transaction["Product Name"] || "N/A"}</TableCell>
                          <TableCell>{transaction.Brand || "N/A"}</TableCell>
                          <TableCell>{transaction.Category || "N/A"}</TableCell>
                          <TableCell>{transaction["Purchase Type"] || "N/A"}</TableCell>
                          <TableCell>{transaction.Date || "N/A"}</TableCell>
                          <TableCell>{formatNaira(transaction["Transaction Cost"])}</TableCell>
                          <TableCell>{transaction["Unit Pack Size"] || "N/A"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          {searchTerm ? "No transactions found matching your search." : "No transactions available."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <MobileTable 
                data={currentTransactions.map(transaction => ({
                  ...transaction,
                  "Transaction Cost": formatNaira(transaction["Transaction Cost"])
                }))} 
                fields={mobileFields} 
                keyField="Transaction ID" 
              />

              {currentTransactions.length === 0 && (
                <div className="sm:hidden text-center py-8 text-muted-foreground text-sm">
                  {searchTerm ? "No transactions found matching your search." : "No transactions available."}
                </div>
              )}

              {totalRecords > 0 && (
                <CustomerPagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  rowsPerPage={rowsPerPage} 
                  totalRecords={totalRecords} 
                  onPageChange={handlePageChange} 
                  onRowsPerPageChange={handleRowsPerPageChange} 
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerPurchases;
