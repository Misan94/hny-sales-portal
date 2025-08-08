import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomerPagination } from "@/components/CustomerPagination";
import { MobileTable } from "@/components/MobileTable";
import { Search, Package } from "lucide-react";
import type { Product } from "@/types/product";
const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const {
    data: products = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products...');
      const {
        data,
        error
      } = await supabase.from('fcmg sample product list').select('*');
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      console.log('Fetched products:', data?.length);
      return data as Product[];
    }
  });

  // Reset to first page when search term or rows per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, rowsPerPage]);

  // Filter products based on search term
  const filteredProducts = products.filter(product => product["Product ID"]?.toLowerCase().includes(searchTerm.toLowerCase()) || product["Product Name"]?.toLowerCase().includes(searchTerm.toLowerCase()) || product.Brand?.toLowerCase().includes(searchTerm.toLowerCase()) || product.Category?.toLowerCase().includes(searchTerm.toLowerCase()));

  // Calculate pagination
  const totalRecords = filteredProducts.length;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
  };
  const mobileFields = [{
    key: "Product ID",
    label: "Product ID"
  }, {
    key: "Product Name",
    label: "Product Name"
  }, {
    key: "Brand",
    label: "Brand"
  }, {
    key: "Category",
    label: "Category"
  }, {
    key: "Unit Pack Size (Grams)",
    label: "Unit Pack Size (g)"
  }, {
    key: "Unit Price",
    label: "Unit Price"
  }, {
    key: "Carton Prize",
    label: "Carton Price"
  }];
  if (error) {
    return <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Products</h2>
            <p className="text-muted-foreground">
              Manage and view your product catalog
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-500">Error loading products: {error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Products</h2>
          <p className="text-muted-foreground">View all existing products</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />
          <span>{totalRecords} products</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? <div className="flex justify-center items-center py-8">
              <p className="text-muted-foreground text-sm sm:text-base">Loading products...</p>
            </div> : <>
              {/* Desktop Table */}
              <div className="hidden sm:block rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Product ID</TableHead>
                      <TableHead className="min-w-[200px]">Product Name</TableHead>
                      <TableHead className="min-w-[120px]">Brand</TableHead>
                      <TableHead className="min-w-[120px]">Category</TableHead>
                      <TableHead className="min-w-[120px]">Unit Pack Size (g)</TableHead>
                      <TableHead className="min-w-[100px]">Unit Price</TableHead>
                      <TableHead className="min-w-[100px]">Carton Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentProducts.length > 0 ? currentProducts.map(product => <TableRow key={product["Product ID"]}>
                          <TableCell className="font-medium">
                            {product["Product ID"]}
                          </TableCell>
                          <TableCell>{product["Product Name"] || "N/A"}</TableCell>
                          <TableCell>{product.Brand || "N/A"}</TableCell>
                          <TableCell>{product.Category || "N/A"}</TableCell>
                          <TableCell>{product["Unit Pack Size (Grams)"] || "N/A"}</TableCell>
                          <TableCell>{product["Unit Price"] || "N/A"}</TableCell>
                          <TableCell>{product["Carton Prize"] || "N/A"}</TableCell>
                        </TableRow>) : <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {searchTerm ? "No products found matching your search." : "No products available."}
                        </TableCell>
                      </TableRow>}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <MobileTable data={currentProducts} fields={mobileFields} keyField="Product ID" />

              {currentProducts.length === 0 && <div className="sm:hidden text-center py-8 text-muted-foreground text-sm">
                  {searchTerm ? "No products found matching your search." : "No products available."}
                </div>}

              {totalRecords > 0 && <CustomerPagination currentPage={currentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} totalRecords={totalRecords} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} />}
            </>}
        </CardContent>
      </Card>
    </div>;
};
export default Products;