import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { getAuth } from "firebase/auth";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Tenant {
  id: string;
  name: string;
  phone: string;
}

export function EditPlot() {
  const navigate = useNavigate();
  const { plotId } = useParams();
  const [plotType, setPlotType] = useState<"lumpsum" | "individual" | null>(
    null
  );

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    caretakerName: "",
    caretakerPhone: "",
    units: "",
    lumpsumExpected: "",
    mpesaNumber: "",
    feePerTenant: "250",
  });

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [phoneValidity, setPhoneValidity] = useState({
    caretaker: true,
    lumpsum: true,
  });

  const [tenantPhoneValidity, setTenantPhoneValidity] = useState<
    Record<string, boolean>
  >({});

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" = "success"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const isCompleteKenyanPhone = (value: string) =>
    value.startsWith("254") && value.length === 12;

  const formatKenyanMobile = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);

    if (digits.startsWith("254") && digits.length === 12) {
      return { value: digits, isValid: true };
    }

    if (digits.startsWith("07") || digits.startsWith("01")) {
      if (digits.length < 10) {
        return { value: digits, isValid: true };
      }
      return { value: `254${digits.slice(1)}`, isValid: true };
    }

    if (digits.length === 0) {
      return { value: "", isValid: true };
    }

    return { value: digits, isValid: false };
  };

  useEffect(() => {
    const fetchPlot = async () => {
      try {
        setLoading(true);

        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          showSnackbar("You must be logged in", "warning");
          return;
        }

        const token = await user.getIdToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/plots/${plotId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load plot");

        const plot = data.plot;

        setPlotType(plot.plotType);

        setFormData({
          name: plot.name,
          location: plot.location,
          caretakerName: plot.caretakerName || "",
          caretakerPhone: plot.caretakerPhone || "",
          units: plot.units?.toString() || "",
          lumpsumExpected: plot.lumpsumExpected?.toString() || "",
          mpesaNumber: plot.mpesaNumber || "",
          feePerTenant: plot.feePerTenant?.toString() || "250",
        });

        setTenants(plot.tenants || []);
      } catch (err: any) {
        console.error(err);
        setNotFound(true);
        showSnackbar(err.message || "Plot not found", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPlot();
  }, [plotId]);

  const addTenant = () => {
    const newTenant: Tenant = {
      id: Date.now().toString(),
      name: "",
      phone: "",
    };
    setTenants([...tenants, newTenant]);
  };

  const updateTenant = (id: string, field: keyof Tenant, value: string) => {
    setTenants(
      tenants.map((tenant) =>
        tenant.id === id ? { ...tenant, [field]: value } : tenant
      )
    );
  };

  const removeTenant = (id: string) => {
    setTenants(tenants.filter((tenant) => tenant.id !== id));
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhones()) return;
    setConfirmOpen(true);
  };

  const handleConfirmUpdate = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        showSnackbar("You must be logged in", "warning");
        return;
      }

      const token = await user.getIdToken();

      const payload = {
        ...formData,
        tenants,
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/plots/${plotId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showSnackbar("Plot updated successfully", "success");
      setConfirmOpen(false);
      setTimeout(() => navigate("/admin/plots"), 800);
    } catch (err: any) {
      showSnackbar(err.message || "Failed to update plot", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <CircularProgress />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">Plot Not Found</h1>
        <Button onClick={() => navigate("/admin/plots")} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Plots
        </Button>
      </div>
    );
  }
  const validatePhones = () => {
    if (
      formData.caretakerPhone &&
      !isCompleteKenyanPhone(formData.caretakerPhone)
    ) {
      showSnackbar(
        "Caretaker phone must be complete (254XXXXXXXXX)",
        "warning"
      );
      return false;
    }

    if (
      plotType === "lumpsum" &&
      formData.mpesaNumber &&
      !isCompleteKenyanPhone(formData.mpesaNumber)
    ) {
      showSnackbar("MPESA number must be complete (254XXXXXXXXX)", "warning");
      return false;
    }

    if (plotType === "individual") {
      const invalidTenant = tenants.some(
        (t) => !isCompleteKenyanPhone(t.phone)
      );
      if (invalidTenant) {
        showSnackbar(
          "All tenant phone numbers must be complete (254XXXXXXXXX)",
          "warning"
        );
        return false;
      }
    }

    return true;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/plots")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Plots
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Plot</h1>
          <p className="text-muted-foreground">Update plot information</p>
        </div>
      </div>

      <form onSubmit={handlePreSubmit} className="max-w-2xl space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plot Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Plot A"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Textarea
                id="location"
                placeholder="e.g., Hunters Road, Nairobi"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caretaker-name">Caretaker Name *</Label>
                <Input
                  id="caretaker-name"
                  placeholder="John Doe"
                  value={formData.caretakerName}
                  onChange={(e) =>
                    setFormData({ ...formData, caretakerName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caretaker-phone">Caretaker Phone *</Label>
                <Input
                  id="caretaker-phone"
                  placeholder="0712345678"
                  value={formData.caretakerPhone}
                  onChange={(e) => {
                    const { value, isValid } = formatKenyanMobile(
                      e.target.value
                    );
                    setFormData({ ...formData, caretakerPhone: value });
                    setPhoneValidity((p) => ({ ...p, caretaker: isValid }));
                  }}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plot Type - Read Only */}
        <Card>
          <CardHeader>
            <CardTitle>Plot Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {plotType === "lumpsum" ? (
                <Badge
                  variant="secondary"
                  className="bg-teal-100 text-teal-800"
                >
                  Lumpsum
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-cyan-100 text-cyan-800"
                >
                  Individual
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                Plot type cannot be changed after creation
              </span>
            </div>

            {/* Conditional Fields */}
            {plotType === "lumpsum" && (
              <div className="space-y-4 pt-4 border-t mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="units">Number of Units *</Label>
                    <Input
                      id="units"
                      type="number"
                      placeholder="10"
                      value={formData.units}
                      onChange={(e) =>
                        setFormData({ ...formData, units: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lumpsum-expected">
                      Lumpsum Expected (KES) *
                    </Label>
                    <Input
                      id="lumpsum-expected"
                      type="number"
                      placeholder="2500"
                      value={formData.lumpsumExpected}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lumpsumExpected: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mpesa-number">MPESA Number</Label>
                    <Input
                      id="mpesa-number"
                      placeholder="0712345678"
                      value={formData.mpesaNumber}
                      onChange={(e) => {
                        const { value, isValid } = formatKenyanMobile(
                          e.target.value
                        );
                        setFormData({ ...formData, mpesaNumber: value });
                        setPhoneValidity((p) => ({ ...p, lumpsum: isValid }));
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {plotType === "individual" && (
              <div className="space-y-4 pt-4 border-t mt-4">
                <div className="space-y-2">
                  <Label htmlFor="fee-per-tenant">Fee per Tenant (KES) *</Label>
                  <Select
                    value={formData.feePerTenant}
                    onValueChange={(value) =>
                      setFormData({ ...formData, feePerTenant: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="200">KES 200</SelectItem>
                      <SelectItem value="250">KES 250</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Tenants</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTenant}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Tenant
                    </Button>
                  </div>

                  {tenants.map((tenant, index) => (
                    <div
                      key={tenant.id}
                      className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end"
                    >
                      <div className="space-y-1">
                        <Label className="text-xs">Tenant Name</Label>
                        <Input
                          placeholder="John Doe"
                          value={tenant.name}
                          onChange={(e) =>
                            updateTenant(tenant.id, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">MPESA Phone</Label>
                        <Input
                          placeholder="0712345678"
                          value={tenant.phone}
                          onChange={(e) => {
                            const { value, isValid } = formatKenyanMobile(
                              e.target.value
                            );
                            updateTenant(tenant.id, "phone", value);
                            setTenantPhoneValidity((p) => ({
                              ...p,
                              [tenant.id]: isValid,
                            }));
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTenant(tenant.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {tenants.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                      No tenants added yet. Click "Add Tenant" to get started.
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit">Update Plot</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/plots")}
          >
            Cancel
          </Button>
        </div>
      </form>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to update this plot. This will immediately affect
              billing, tenants, and reconciliation records.
              <br />
              <br />
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUpdate}>
              Yes, Update Plot
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
