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

  function printReceipt58mm(payment) {
    const {
      id,
      plotName,
      amount = {},
      less,
      name,
      phone,
      time,
      monthPaid = [],
      status = [],
    } = payment;

    const derivedStatus = status.some((s) => s.state === "incomplete")
      ? "INCOMPLETE"
      : status.some((s) => s.state === "complete")
      ? "COMPLETE"
      : "UNRECOGNIZED";

    const total = amount.total ?? 0;
    const mpesa = amount.mpesa ?? null;
    const cash = amount.cash ?? null;

    const qrUrl =
      "https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://jobawu.vercel.app/authenticated";

    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Receipt</title>

<style>
  @page {
    size: 58mm auto;
    margin: 0;
  }

  body {
    width: 58mm;
    margin: 0;
    padding: 6px;
    font-family: monospace;
    font-size: 10px;
    color: #000;
    font-stretch: condensed;
  }

  .center { text-align: center; }
  .bold { font-weight: bold; }
  .line { border-top: 0px dashed #000; margin: 2px 0; }

  .row {
    display: flex;
    justify-content: space-between;
  }

  .small { font-size: 10px; }

  h2 {
    text-align: center;
  }

  img.qr {
    width: 32mm;
    height: 32mm;
  }
  p {
    text-align: center;
    margin-top:4px;
  }
</style>
</head>

<body>

  <!-- LOGO -->
  <div class="center">
  <h2>JOBAWU GENERAL MERCHANTS</h2>
  </div>

  <div class="center bold">PAYMENT RECEIPT</div>

<p> _____________________________ </p>

  <div class="small">
    <div>Receipt No:</div>
    <div class="bold">${id}</div>

    <div style="margin-top:4px;">Date:</div>
  </div>

<p> xxxxxxxxxxxxxxxxxxxxx </p>

  <div>
    <div>${plotName || "—"}</div>
  </div>

<p> _____________________________ </p>
  <div>
    <div class="bold">Customer</div>
    <div>${name}</div>
    <div class="small">${phone}</div>
  </div>

<p> _____________________________ </p>
  <div>
    <div class="row bold">
      <p>TOTAL PAID:  KSH.${total.toLocaleString()}.00</p>
    </div>

    ${
      mpesa != null
        ? `<div class="row"><span>MPESA</span><span>${mpesa}</span></div>`
        : ""
    }
    ${
      cash != null
        ? `<div class="row"><span>CASH</span><span>${cash}</span></div>`
        : ""
    }
  </div>

<p> _____________________________ </p>

  <div>
    

<p> _____________________________ </p>

  <div>
    <div class="bold">Status</div>
    <div>${derivedStatus}</div>

    ${
      less?.amount
        ? `
          <div class="small">
            Due: KES ${less.amount}<br/>
            Month: ${less.dueMonth}
          </div>
        `
        : `<div class="small">Cleared</div>`
    }
  </div>

<p> _____________________________ </p>

  <!-- QR CODE -->
  <div class="center">
    <img src="${qrUrl}" class="qr" />
    <div class="small">Verify Payment</div>
  </div>

<p> __________________________ </p>

  <div class="center small">
    Served by: <span class="bold">Grace</span>
  </div>

  <!-- CONTACT -->
  <div class="center small">
    <div class="bold">CONTACT</div>
    P.O BOX 57655 - 00200<br/>
    Nairobi<br/>
    TEL: 0728 290 280
  </div>

<p> _____________________________ </p>
  <div class="center bold">
    Thank you!
  </div>

</body>
</html>
`;

    const printWindow = window.open("", "_blank", "width=300,height=600");
    printWindow.document.open();
    printWindow.document.write(receiptHTML);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }

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
                <TableHead>Plot Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Amount Due</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Month(s) Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!loading &&
                filteredPayments.map((p) => {
                  const amount = p.amount ?? {};
                  const monthPaid = Array.isArray(p.monthPaid)
                    ? p.monthPaid
                    : [];
                  const statusArr = Array.isArray(p.status) ? p.status : [];

                  const derivedStatus = statusArr.some(
                    (s) => s.state === "incomplete"
                  )
                    ? "INCOMPLETE"
                    : statusArr.some((s) => s.state === "complete")
                    ? "COMPLETE"
                    : "UNRECOGNIZED";

                  return (
                    <TableRow key={p.id} className="align-top">
                      {/* Transaction ID */}
                      <TableCell className="font-mono text-xs">
                        {p.id}
                      </TableCell>

                      {/* Plot Name */}
                      <TableCell className="font-medium">
                        {p.plotName || "—"}
                      </TableCell>

                      {/* Amount (grid) */}
                      <TableCell>
                        <div className="grid grid-cols-1 gap-1 text-sm">
                          {amount.total != null && (
                            <div className="font-semibold">
                              KES {amount.total.toLocaleString()}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {amount.mpesa != null && (
                              <Badge variant="outline">
                                MPESA · {amount.mpesa}
                              </Badge>
                            )}
                            {amount.cash != null && (
                              <Badge variant="secondary">
                                CASH · {amount.cash}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Amount Due */}
                      <TableCell>
                        {p.less?.amount ? (
                          <div className="text-sm">
                            <div className="font-semibold text-red-600">
                              KES {p.less.amount.toLocaleString()}
                            </div>
                            <div className="text-muted-foreground">
                              Due · {p.less.dueMonth}
                            </div>
                          </div>
                        ) : (
                          <Badge className="bg-green-100 text-green-700">
                            Cleared
                          </Badge>
                        )}
                      </TableCell>

                      {/* Customer */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {p.phone}
                          </div>
                        </div>
                      </TableCell>

                      {/* Time */}
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {p.time}
                      </TableCell>

                      {/* Months Paid */}
                      <TableCell>
                        {monthPaid.length > 0 ? (
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            {monthPaid.map((m, idx) => (
                              <div
                                key={idx}
                                className="rounded border px-2 py-1"
                              >
                                <div className="font-medium">{m.month}</div>
                                <div className="text-muted-foreground">
                                  KES {m.amount}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            —
                          </span>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          className={
                            derivedStatus === "COMPLETE"
                              ? "bg-green-100 text-green-700"
                              : derivedStatus === "INCOMPLETE"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {derivedStatus}
                        </Badge>
                      </TableCell>

                      {/* Actions (UNCHANGED LOGIC) */}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPayment(p);
                                setEditOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Payment
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => printReceipt58mm(p)}
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
