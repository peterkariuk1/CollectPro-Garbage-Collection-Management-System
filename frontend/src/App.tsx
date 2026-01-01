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

import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { AuthGate } from "../AuthGate.tsx";
import { NetworkStatus } from "./components/system/NetworkStatus.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="gc-app-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <NetworkStatus/>

        <BrowserRouter>
          <AuthGate>
            <Routes>
              {/* Public (Login) */}
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              {/* Dashboard */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/dashboard"
                  element={
                    <>
                      <Header />
                      <Dashboard />
                    </>
                  }
                />

                <Route
                  path="/plot/:plotId"
                  element={
                    <>
                      <Header />
                      <PlotDetail />
                    </>
                  }
                />
              </Route>

              {/* Admin (role protected) */}
              <Route
                element={<ProtectedRoute allowedRoles={["admin", "manager"]} />}
              >
                <Route
                  path="/admin"
                  element={
                    <>
                      <Header />
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
              </Route>

              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthGate>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
