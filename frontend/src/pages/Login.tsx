import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Building2 } from "lucide-react";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { auth, db } from "../../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" = "success"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Frontend validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showSnackbar("Invalid email format.", "warning");
      setLoading(false);
      return;
    }

    if (password === email) {
      showSnackbar("Password cannot be the same as email.", "warning");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      showSnackbar("Password must be at least 8 characters.", "warning");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Save user in Firestore with null role
        const userRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userRef, {
          email,
          role: null,
          createdAt: new Date(),
        });

        showSnackbar(
          "Account created! Admin will assign your role before login.",
          "success"
        );
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const userRef = doc(db, "users", userCredential.user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          showSnackbar("User record not found. Contact admin.", "error");
          return;
        }

        const userData = userSnap.data();

        if (!userData.role) {
          showSnackbar(
            "Your role is not assigned yet. Contact admin.",
            "warning"
          );
          return;
        }

        if (userData.role !== "admin" && userData.role !== "manager") {
          showSnackbar(
            "You do not have permission to access this dashboard.",
            "error"
          );
          return;
        }

        showSnackbar("Login successful!", "success");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        showSnackbar("Email is already in use. Try logging in.", "error");
      } else if (error.code === "auth/wrong-password") {
        showSnackbar("Incorrect password.", "error");
      } else if (error.code === "auth/user-not-found") {
        showSnackbar("User not found.", "error");
      } else {
        showSnackbar(error.message || "Something went wrong", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dashboard flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md card-elevated">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Building2 className="h-6 w-6" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Jobawu General Merchants</CardTitle>
            <p className="text-muted-foreground mt-2">
              {isSignUp
                ? "Sign up to request access. Admin will assign your role."
                : "Sign in to your garbage collection management dashboard"}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? isSignUp
                  ? "Signing up..."
                  : "Signing in..."
                : isSignUp
                ? "Sign Up"
                : "Sign In"}
            </Button>
          </form>

          <Separator />

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Button>
        </CardContent>
      </Card>

      {/* MUI Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
