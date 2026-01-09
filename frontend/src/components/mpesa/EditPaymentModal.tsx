import { getAuth } from "firebase/auth";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function EditPaymentModal({ open, onClose, payment }) {
  const [name, setName] = useState(payment.name || "");
  const [phone, setPhone] = useState(payment.phone || "");
  const [cash, setCash] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User not authenticated");
      }

      const idToken = await user.getIdToken(true);

      const res = await fetch(
        `${API_BASE}/api/payments/${payment.id}`, // 🔑 IMPORTANT
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            name,
            phone,
            amount: cash !== "" ? { cash: Number(cash) } : undefined,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update payment");
      }

      showSnackbar("Payment updated successfully", "success");
      setConfirmOpen(false);
      onClose();
    } catch (error: any) {
      showSnackbar(error.message || "Failed to update payment", "error");
    }
  };

  return (
    <>
      {/* MAIN EDIT MODAL */}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Payment</DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Payer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />

            <TextField
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />

            <TextField
              label="Add Cash Amount"
              type="number"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              helperText="MPESA amount cannot be edited"
              fullWidth
            />

            <Typography variant="caption" color="text.secondary">
              Plot name and MPESA payments are locked
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={() => setConfirmOpen(true)}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* CONFIRMATION DIALOG */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent>
          Are you sure you want to update this payment?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            No
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Yes, Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
