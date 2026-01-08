// Header.jsx
import { useState } from "react";
import { User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import logoImage from "../assets/garbagelogo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from "react-router-dom";
import { Frown, LogOut } from "lucide-react";

// Firebase
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

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
export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [logoutOpen, setLogoutOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isDashboard = location.pathname.startsWith("/dashboard");
  const isAdmin = location.pathname.startsWith("/admin");

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
    <>
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex flex-col gap-2 px-4 py-2">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center">
              <img className="w-[60px]" src={logoImage} alt="logo" />
              <div className="relative overflow-hidden max-w-[220px] md:max-w-none">
                <span className="inline-block font-semibold text-lg ml-2 animate-marquee md:animate-none">
                  Jowabu General Merchants
                </span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  {!isDashboard && (
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        navigate("/dashboard");
                      }}
                    >
                      Dashboard
                    </DropdownMenuItem>
                  )}

                  {!isAdmin && (
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        navigate("/admin");
                      }}
                    >
                      Admin Panel
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => setLogoutOpen(true)}
                    className="text-red-600"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
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
    </>
  );
}
