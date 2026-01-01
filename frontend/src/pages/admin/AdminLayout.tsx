import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  FileText,
  HousePlus,
  LogOut,
  Frown,
  Menu,
  X,
  CircleDollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Firebase
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase.ts";

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Button as MuiButton,
} from "@mui/material";

const adminNavItems = [
  { title: "Payments", url: "/admin", icon: CircleDollarSign },
  { title: "View Plots", url: "/admin/plots", icon: Building2 },
  { title: "Register Plot", url: "/admin/plots/new", icon: HousePlus },
  { title: "Tenants", url: "/admin/tenants", icon: Users },
  { title: "Receipts & Exports", url: "/admin/receipts", icon: FileText },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const user = auth.currentUser;

  const [logoutOpen, setLogoutOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showSnackbar("Logged out successfully", "success");
      navigate("/login");
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to logout. Try again.", "error");
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Toggle button (mobile only) */}
      <div className="fixed top-18 left-2 z-50 md:hidden">
        <Button variant="outline" size="icon" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-background border-r
        transform transition-transform duration-300 ease-in-out md:pt-1 pt-[120px]
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-4 border-b font-semibold">Navigation</div>

        <nav className="p-2 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <button
                key={item.title}
                onClick={() => {
                  navigate(item.url);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm
                  ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted"
                  }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 mt-auto border-t">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">
                {user?.email ?? "—"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLogoutOpen(true)}
            className="w-full justify-start text-muted-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 md:ml-0">
        <Outlet />
      </main>

      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)}>
        <DialogTitle className="flex items-center gap-2">
          <Frown color="#3e9392" />
          Confirm Logout
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out? You’ll need to sign in again to
            access the system.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <MuiButton onClick={() => setLogoutOpen(false)} variant="outlined">
            Cancel
          </MuiButton>

          <MuiButton
            onClick={async () => {
              setLogoutOpen(false);
              await handleLogout();
            }}
            color="error"
            variant="contained"
            startIcon={<LogOut />}
          >
            Logout
          </MuiButton>
        </DialogActions>
      </Dialog>

      {/* Snackbar Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
