import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PlotDetail from "./pages/PlotDetail";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { RecentPayments } from "./pages/admin/RecentPayments";
import { ViewPlots } from "@/pages/admin/ViewPlots";
import { RegisterPlot } from "@/pages/admin/RegisterPlot";
import { EditPlot } from "@/pages/admin/EditPlot";
import { Tenants } from "@/pages/admin/Tenants";
import { Receipts } from "@/pages/admin/Receipts";
import { Settings } from "@/pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="gc-app-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <>
                  <Header /> {/* full header with search */}
                  <Dashboard />
                </>
              }
            />
            <Route
              path="/plot/:plotId"
              element={
                <>
                  <Header /> {/* full header with search */}
                  <PlotDetail />
                </>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <>
                  <Header />{" "}
                  <AdminLayout />
                </>
              }
            >
              <Route index element={<RecentPayments />} />
              <Route path="plots" element={<ViewPlots />} />
              <Route path="plots/new" element={<RegisterPlot />} />
              <Route path="plots/:plotId/edit" element={<EditPlot />} />
              <Route path="tenants" element={<Tenants />} />
              <Route path="receipts" element={<Receipts />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
