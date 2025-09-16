import { useState } from "react";
import { Search, Phone, Building2, DollarSign } from "lucide-react";
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

// Mock tenant data
const mockTenants = [
  {
    id: "1",
    name: "John Doe",
    phone: "0712345678",
    plotName: "Plot A",
    plotLocation: "Hunters Road",
    fee: 250,
    status: "paid" as const,
    lastPayment: "2025-09-15",
  },
  {
    id: "2", 
    name: "Jane Smith",
    phone: "0787654321",
    plotName: "Plot A",
    plotLocation: "Hunters Road", 
    fee: 250,
    status: "unpaid" as const,
    lastPayment: null,
  },
  {
    id: "3",
    name: "Mike Johnson", 
    phone: "0798765432",
    plotName: "Plot B",
    plotLocation: "Riverside Drive",
    fee: 200,
    status: "pending" as const,
    lastPayment: "2025-09-10",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    phone: "0723456789", 
    plotName: "Plot C",
    plotLocation: "Valley Road",
    fee: 250,
    status: "paid" as const,
    lastPayment: "2025-09-14",
  },
];

export function Tenants() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTenants = mockTenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.phone.includes(searchTerm) ||
    tenant.plotName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: mockTenants.length,
    paid: mockTenants.filter(t => t.status === "paid").length,
    unpaid: mockTenants.filter(t => t.status === "unpaid").length,
    pending: mockTenants.filter(t => t.status === "pending").length,
  };

  const handleContact = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleGenerateReceipt = (tenantId: string) => {
    console.log("Generate receipt for tenant:", tenantId);
  };

  return (
    <div className="py-6 space-y-6 md:w-full w-[88vw] m-auto">
      <div>
        <h1 className="text-3xl font-bold">Tenant Management</h1>
        <p className="text-muted-foreground">
          View and manage all tenants across plots
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tenants
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paid This Month
            </CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.paid}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payment
            </CardTitle>
            <DollarSign className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unpaid
            </CardTitle>
            <DollarSign className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.unpaid}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tenants, phone, or plot..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tenants Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tenants</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Plot</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{tenant.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {tenant.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{tenant.plotName}</div>
                      <div className="text-sm text-muted-foreground">{tenant.plotLocation}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">KES {tenant.fee}</Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={tenant.status} />
                  </TableCell>
                  <TableCell>
                    {tenant.lastPayment ? (
                      <span className="text-sm">{tenant.lastPayment}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContact(tenant.phone)}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateReceipt(tenant.id)}
                      >
                        Receipt
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTenants.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No tenants found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "No tenants have been added yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}