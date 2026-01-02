import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  MapPinHouse,
  Trash2,
  Eye,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { PlotTypeBadge } from "@/components/plot-type-badge";
import { getAuth } from "firebase/auth";
import Loader from "@/components/system/Loader";

export function ViewPlots() {
  const navigate = useNavigate();
  const [plots, setPlots] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [plotToDelete, setPlotToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const fetchPlots = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        showSnackbar("You must be logged in", "warning");
        return;
      }
      const idToken = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/plots/getplots`,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );
      const data = await res.json().catch(() => {
        throw new Error("Invalid JSON response");
      });
      if (!res.ok) throw new Error(data.message || "Failed to fetch plots");
      setPlots(data.plots || []);
    } catch (err: any) {
      console.error("Fetch plots error:", err);
      showSnackbar(err.message || "Error fetching plots", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (plotId: string) => {
    setPlotToDelete(plotId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!plotToDelete) return;

    try {
      setDeleteLoading(true);

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        showSnackbar("You must be logged in", "warning");
        return;
      }

      const idToken = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/plots/${plotToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Delete response not JSON:", text);
        throw new Error("Invalid response from server");
      }

      if (!res.ok) throw new Error(data.message || "Failed to delete plot");

      showSnackbar(data.message || "Plot deleted successfully", "success");
      setPlots((prev) => prev.filter((p) => p.id !== plotToDelete));
    } catch (err: any) {
      console.error("Delete plot error:", err);
      showSnackbar(err.message || "Failed to delete plot", "error");
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setPlotToDelete(null);
    }
  };

  useEffect(() => {
    fetchPlots();
  }, []);

  const filteredPlots = plots.filter(
    (plot) =>
      plot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plot.caretakerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plot.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Plots</h1>
          <p className="text-muted-foreground">
            View and manage all registered plots
          </p>
        </div>
        <Button onClick={() => navigate("/admin/plots/new")}>
          <Plus className="h-4 w-4 mr-2" /> Register New Plot
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search plots..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <Loader />
      ) : filteredPlots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlots.map((plot) => (
            <Card key={plot.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{plot.name}</CardTitle>
                      <PlotTypeBadge type={plot.plotType} />
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPinHouse className="w-4 h-4" />
                      {plot.location}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/plot/${plot.id}`, {
                            state: { from: "/admin/plots" },
                          })
                        }
                      >
                        <Eye className="h-4 w-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate(`/admin/plots/${plot.id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(plot.id)}
                        className="text-destructive"
                      >
                        {deleteLoading && plotToDelete === plot.id ? (
                          <CircularProgress size={16} className="mr-2" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Units:</span>
                  <span className="font-medium">{plot.units}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Caretaker:</span>
                  <span className="font-medium">{plot.caretakerName}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No plots found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Get started by registering your first plot"}
          </p>
          <Button onClick={() => navigate("/admin/plots/new")}>
            <Plus className="h-4 w-4 mr-2" /> Register Plot
          </Button>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this plot? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteLoading ? <CircularProgress size={16} /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
