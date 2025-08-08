import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseCustomer } from "@/types/customer";
import { CustomerPagination } from "@/components/CustomerPagination";
const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<SupabaseCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  useEffect(() => {
    fetchCustomers();
  }, [currentPage, rowsPerPage, searchTerm]);
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching customers from Supabase...");

      // If there's a search term, fetch all data for client-side filtering
      if (searchTerm) {
        const {
          data,
          error,
          count
        } = await supabase.from("fmcg sample customer data").select("*", {
          count: 'exact'
        }).order("Customer ID");
        console.log("Supabase response:", {
          data,
          error,
          count
        });
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        setCustomers(data || []);
        setTotalRecords(count || 0);
      } else {
        // Server-side pagination when no search
        const from = (currentPage - 1) * rowsPerPage;
        const to = from + rowsPerPage - 1;
        const {
          data,
          error,
          count
        } = await supabase.from("fmcg sample customer data").select("*", {
          count: 'exact'
        }).order("Customer ID").range(from, to);
        console.log("Supabase response:", {
          data,
          error,
          count
        });
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        setCustomers(data || []);
        setTotalRecords(count || 0);
      }
      console.log("Customers fetched successfully:", customers.length);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering for search results
  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const filtered = customers.filter(customer => {
      const searchLower = searchTerm.toLowerCase();
      return customer["Customer ID"]?.toLowerCase().includes(searchLower) || customer["First Name"]?.toLowerCase().includes(searchLower) || customer["Last Name"]?.toLowerCase().includes(searchLower) || customer["Gender"]?.toLowerCase().includes(searchLower) || customer["Local Government"]?.toLowerCase().includes(searchLower) || customer["State"]?.toLowerCase().includes(searchLower) || customer["Age"]?.toString().includes(searchLower) || customer["Household Size"]?.toString().includes(searchLower);
    });
    return filtered;
  }, [customers, searchTerm]);

  // Paginate filtered results for search
  const paginatedCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const from = (currentPage - 1) * rowsPerPage;
    const to = from + rowsPerPage;
    return filteredCustomers.slice(from, to);
  }, [filteredCustomers, currentPage, rowsPerPage, searchTerm]);
  const displayedCustomers = searchTerm ? paginatedCustomers : customers;
  const displayedTotal = searchTerm ? filteredCustomers.length : totalRecords;
  const totalPages = Math.ceil(displayedTotal / rowsPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };
  if (loading) {
    return <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading customers...</span>
      </div>;
  }
  if (error) {
    return <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Customers</h2>
            <p className="text-muted-foreground">
              Manage and view your customer database
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-500">Error loading customers: {error}</p>
              <button onClick={fetchCustomers} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Customers</h2>
          <p className="text-muted-foreground">View all existing customers</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{displayedTotal} customers</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          
          
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search customers..." value={searchTerm} onChange={e => handleSearchChange(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Customer ID</TableHead>
                  <TableHead className="font-medium">First Name</TableHead>
                  <TableHead className="font-medium">Last Name</TableHead>
                  <TableHead className="font-medium">Age</TableHead>
                  <TableHead className="font-medium">Gender</TableHead>
                  <TableHead className="font-medium">Local Government</TableHead>
                  <TableHead className="font-medium">State</TableHead>
                  <TableHead className="font-medium">Household Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedCustomers.length === 0 ? <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {totalRecords === 0 ? "No customers found in the database." : "No customers found matching your search."}
                    </TableCell>
                  </TableRow> : displayedCustomers.map(customer => <TableRow key={customer["Customer ID"]} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{customer["Customer ID"]}</TableCell>
                      <TableCell>{customer["First Name"] || "-"}</TableCell>
                      <TableCell>{customer["Last Name"] || "-"}</TableCell>
                      <TableCell>{customer["Age"] || "-"}</TableCell>
                      <TableCell>{customer["Gender"] || "-"}</TableCell>
                      <TableCell>{customer["Local Government"] || "-"}</TableCell>
                      <TableCell>{customer["State"] || "-"}</TableCell>
                      <TableCell>{customer["Household Size"] || "-"}</TableCell>
                    </TableRow>)}
              </TableBody>
            </Table>
          </div>
          
          {displayedTotal > 0 && <CustomerPagination currentPage={currentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} totalRecords={displayedTotal} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} />}
        </CardContent>
      </Card>
    </div>;
};
export default Customers;