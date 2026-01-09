import { useEffect, useMemo, useState } from "react";
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
import { Snackbar, Alert } from "@mui/material";
import { getAuth } from "firebase/auth";

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
import EditPaymentModal from "@/components/mpesa/EditPaymentModal";
import { CircularProgress } from "@mui/material";

export function RecentPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stkOpen, setStkOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<any>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  /* ---------------- FETCH PAYMENTS ---------------- */
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return console.warn("You must be logged in");
        const idToken = await user.getIdToken();

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/payments`,
          {
            headers: { Authorization: `Bearer ${idToken}` },
          }
        );

        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        setPayments(data.payments);
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err.message || "Failed to load payments",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  /* ---------------- SEARCH ---------------- */
  const filteredPayments = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return payments.filter(
      (p) =>
        p.id?.toLowerCase().includes(q) ||
        p.phone?.includes(q) ||
        p.name?.toLowerCase().includes(q) ||
        p.source?.toLowerCase().includes(q)
    );
  }, [payments, searchTerm]);

  const STATUS_BADGE: Record<string, string> = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    incomplete: "bg-red-100 text-red-700",
  };

  const handleDeleteClick = (payment: any) => {
    setPaymentToDelete(payment);
    setDeleteConfirmOpen(true);
  };

  // Delete function
  const handleConfirmDelete = async () => {
    if (!paymentToDelete) return;

    try {
      setDeleteLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("Not logged in");

      const idToken = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/payments/${
          paymentToDelete.id
        }`,
        { method: "DELETE", headers: { Authorization: `Bearer ${idToken}` } }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      // Remove deleted payment locally
      setPayments((prev) => prev.filter((p) => p.id !== paymentToDelete.id));

      setSnackbar({ open: true, message: data.message, severity: "success" });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to delete payment",
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
      setPaymentToDelete(null);
    }
  };

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
            Prompt
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

      {/* Search */}
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
              {!loading &&
                filteredPayments.map((p) => {
                  const amountObj = p.amount ?? {};
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.id}</TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {amountObj.mpesa != null && (
                            <Badge variant="outline">
                              MPESA · KES {amountObj.mpesa}
                            </Badge>
                          )}
                          {amountObj.cash != null && (
                            <Badge variant="secondary">
                              CASH · KES {amountObj.cash}
                            </Badge>
                          )}
                          {/* Conditional balance or overpayment */}
                          {p.overpayment != null && p.overpayment > 0 ? (
                            <Badge variant="success">
                              Overpayment · KES {p.overpayment}
                            </Badge>
                          ) : p.balance != null && p.balance !== 0 ? (
                            <Badge variant="destructive">
                              Balance · KES {p.balance}
                            </Badge>
                          ) : null}
                        </div>
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

                      <TableCell className="text-sm text-muted-foreground">
                        {p.month}
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary">{p.source}</Badge>
                      </TableCell>

                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            STATUS_BADGE[p.status] ??
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {p.status}
                        </span>
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
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPayment(p);
                                setEditOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit Payment
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => printReceipt(p.id)}
                            >
                              <Receipt className="h-4 w-4 mr-2" />
                              Generate Receipt
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteClick(p)}
                            >
                              {deleteLoading && paymentToDelete?.id === p.id ? (
                                <CircularProgress size={14} className="mr-2" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                              )}
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          {!loading && filteredPayments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No payments found
            </div>
          )}
        </CardContent>
      </Card>

      {selectedPayment && (
        <EditPaymentModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          payment={selectedPayment}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg p-6 w-[300px] space-y-4">
            <h2 className="text-lg text-black font-bold">Confirm Delete</h2>
            <p className="text-red-600 font-bold">
              Are you sure you want to delete this payment?
              <br />
              This action is irreversible
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setPaymentToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <CircularProgress size={16} className="mr-2" />
                ) : null}
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
