import { useEffect, useMemo, useState } from "react";
import { Search, Phone, Building2, DollarSign, Printer } from "lucide-react";
import { getAuth } from "firebase/auth";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";

type RowType = "tenant" | "caretaker";

interface TenantRow {
  id: string;
  type: RowType;
  name: string;
  phone: string;
  plotName: string;
  plotLocation: string;
  fee: number;
  status: "paid" | "unpaid" | "pending";
  lastPayment: number;
}

export function Tenants() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState<TenantRow[]>([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH PLOTS → BUILD TENANTS
  // ===============================
  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const token = await user.getIdToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/plots/getplots`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        const derivedRows: TenantRow[] = [];

        data.plots.forEach((plot: any) => {
          // -------- CARETAKER ROW --------
          if (plot.caretakerName && plot.caretakerPhone) {
            derivedRows.push({
              id: `caretaker-${plot.id}`,
              type: "caretaker",
              name: plot.caretakerName,
              phone: plot.caretakerPhone,
              plotName: plot.name,
              plotLocation: plot.location,
              fee: 0,
              status: "unpaid",
              lastPayment: 0,
            });
          }

          // -------- TENANT ROWS (INDIVIDUAL ONLY) --------
          if (plot.plotType === "individual" && Array.isArray(plot.tenants)) {
            plot.tenants.forEach((tenant: any, index: number) => {
              derivedRows.push({
                id: `${plot.id}-tenant-${index}`,
                type: "tenant",
                name: tenant.name,
                phone: tenant.phone,
                plotName: plot.name,
                plotLocation: plot.location,
                fee: 0,
                status: "unpaid",
                lastPayment: 0,
              });
            });
          }
        });

        setRows(derivedRows);
      } catch (err) {
        console.error("FETCH TENANTS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlots();
  }, []);

  // ===============================
  // LIVE SEARCH
  // ===============================
  const filteredRows = useMemo(() => {
    const q = searchTerm.toLowerCase();

    return rows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.phone.includes(q) ||
        row.plotName.toLowerCase().includes(q) ||
        row.plotLocation.toLowerCase().includes(q)
    );
  }, [rows, searchTerm]);

  // ===============================
  // STATS (TENANTS ONLY)
  // ===============================
  const tenantRows = rows.filter((r) => r.type === "tenant");

  const stats = {
    total: tenantRows.length,
    paid: 0,
    pending: 0,
    unpaid: tenantRows.length,
  };

  const handleContact = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="py-6 space-y-6 md:w-full w-[88vw] m-auto">
      <div>
        <h1 className="text-3xl font-bold">Tenant Management</h1>
        <p className="text-muted-foreground">
          View tenants and caretakers across all plots
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Tenants
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Paid This Month
            </CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Pending Payment
            </CardTitle>
            <DollarSign className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Unpaid
            </CardTitle>
            <DollarSign className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.unpaid}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tenant, caretaker, phone or plot..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tenants And Caretakers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant / Caretaker</TableHead>
                <TableHead>Plot</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div>
                      <div
                        className={`font-medium ${
                          row.type === "caretaker" ? "text-yellow-600" : ""
                        }`}
                      >
                        {row.name}
                        {row.type === "caretaker" && " (Caretaker)"}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {row.phone}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div>
                      <div className="font-medium">{row.plotName}</div>
                      <div className="text-sm text-muted-foreground">
                        {row.plotLocation}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">KES 0</Badge>
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>

                  <TableCell>
                    <span className="text-sm text-muted-foreground">0</span>
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContact(row.phone)}
                    >
                      <Phone className="h-3 w-3 mr-2" />
                      Contact
                    </Button>
                    <Button variant="outline" size="sm">
                      <Printer className="h-3 w-3 mr-2" />
                      Receipt
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {!loading && filteredRows.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
