import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Snackbar,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { WifiOff, Wifi } from "lucide-react";

export function NetworkStatus() {
  const [offline, setOffline] = useState(!navigator.onLine);
  const [showRestore, setShowRestore] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "warning";
  }>({ open: false, message: "", severity: "warning" });

  const wasOffline = useRef(!navigator.onLine);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const handleOffline = () => {
      wasOffline.current = true;
      setOffline(true);
      setSnackbar({
        open: true,
        message: "You are offline. Some actions are unavailable.",
        severity: "warning",
      });
    };

    const handleOnline = () => {
      if (wasOffline.current) {
        setOffline(false);
        setShowRestore(true);
        setSnackbar({
          open: true,
          message: "Internet connection restored",
          severity: "success",
        });

        setTimeout(() => setShowRestore(false), 2000);
        wasOffline.current = false;
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <>
      {/* 🔴 OFFLINE BLOCKING MODAL */}
      <Dialog open={offline} disableEscapeKeyDown maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            No Internet Connection
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            gap={2}
            py={2}
          >
            <WifiOff size={isMobile ? 40 : 56} color="red" />

            <Typography variant="body1" fontWeight={500}>
              You’re offline
            </Typography>

            <Typography variant="body2" color="text.secondary" maxWidth={320}>
              Please check your internet connection. This app requires an active
              connection to function properly.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={showRestore} maxWidth="xs" fullWidth>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            gap={2}
            py={3}
          >
            <Wifi
              size={isMobile ? 40 : 56}
              color="green"
              className="text-success"
            />

            <Typography variant="h6" fontWeight={600}>
              Back Online
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Your internet connection has been restored.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* 🔔 GLOBAL SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
