
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoginGuard } from "@/components/auth/LoginGuard";
import { DashboardLayout } from "@/components/DashboardLayout";
import Home from "./pages/Home";
import Customers from "./pages/Customers";
import CustomerPurchases from "./pages/CustomerPurchases";
import Products from "./pages/Products";
import CustomerSegmentation from "./pages/CustomerSegmentation";
import ProductRecommendations from "./pages/ProductRecommendations";
import ChurnPrediction from "./pages/ChurnPrediction";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={
              <LoginGuard>
                <Login />
              </LoginGuard>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Home />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/customers" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Customers />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/purchases" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CustomerPurchases />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Products />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/segments" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CustomerSegmentation />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/predictive-analysis" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ProductRecommendations />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/churn-analysis" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ChurnPrediction />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            {/* Protect the NotFound route to prevent unauthorized access */}
            <Route path="*" element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
