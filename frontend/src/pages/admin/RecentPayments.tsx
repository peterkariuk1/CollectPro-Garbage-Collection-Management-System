import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Download,
  Smartphone,
  MoreVertical,
  Receipt,
  Trash2,
  Edit,
  CheckCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StkPushModal } from "../../components/mpesa/StkPushModal";

type PaymentStatus = "pending" | "reconciled";
type PaymentSource = "C2B" | "STK" | "PULL" | "CASH";

interface PaymentRow {
  id: string;
  amount: number;
  phone: string;
  name: string;
  time: string;
  month: string;
  source: PaymentSource;
  status: PaymentStatus;
}

/* ---------------- MOCK DATA ---------------- */
const MOCK_PAYMENTS: PaymentRow[] = [
  {
    id: "QHJ7XYZ123",
    amount: 1500,
    phone: "254712345678",
    name: "John Mwangi",
    time: "2025-01-12 09:21",
    month: "January",
    source: "C2B",
    status: "pending",
  },
  {
    id: "NLJ89ABC",
    amount: 2000,
    phone: "254798765432",
    name: "Caretaker - Peter",
    time: "2025-01-11 18:40",
    month: "January",
    source: "STK",
    status: "reconciled",
  },
  {
    id: "PLK00212",
    amount: 1000,
    phone: "254701112233",
    name: "Mary Wanjiku",
    time: "2025-01-10 14:05",
    month: "January",
    source: "PULL",
    status: "reconciled",
  },
];

export function RecentPayments() {
  const [stkOpen, setStkOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  /* ---------------- SEARCH ---------------- */
  const filteredPayments = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return MOCK_PAYMENTS.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.source.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  /* ---------------- RENDER ---------------- */
  return (
    <div className="py-6 space-y-6 md:w-full w-[88vw] m-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Recent Payments</h1>
          <p className="text-muted-foreground">
            View and manage all incoming payments
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setStkOpen(true)}>
            <Smartphone className="h-4 w-4 mr-2" />
            STK Push
          </Button>

          <StkPushModal open={stkOpen} onClose={() => setStkOpen(false)} />
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Pull Transactions
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Payment
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transaction, phone, name or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button variant="outline">Filters</Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Month Paid</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredPayments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.id}</TableCell>

                  <TableCell>
                    <Badge variant="outline">KES {p.amount}</Badge>
                  </TableCell>

                  <TableCell>
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {p.phone}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {p.time}
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary">{p.source}</Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        p.status === "reconciled" ? "success" : "warning"
                      }
                    >
                      {p.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        {p.status === "pending" && (
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Reconcile
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Payment
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Receipt className="h-4 w-4 mr-2" />
                          Generate Receipt
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No payments found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
