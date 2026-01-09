import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAuth } from "firebase/auth";

interface Tenant {
  id: string;
  name: string;
  phone: string;
  amount: string;
}

export function RegisterPlot() {
  const navigate = useNavigate();

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
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [phoneValidity, setPhoneValidity] = useState({
    caretaker: true,
    lumpsum: true,
  });
  const [tenantPhoneValidity, setTenantPhoneValidity] = useState<
    Record<string, boolean>
  >({});

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const addTenant = () => {
    setTenants([
      ...tenants,
      { id: Date.now().toString(), name: "", phone: "", amount: "250" },
    ]);
  };

  const updateTenant = (id: string, field: keyof Tenant, value: string) => {
    setTenants(
      tenants.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const removeTenant = (id: string) => {
    setTenants(tenants.filter((t) => t.id !== id));
  };
  const isCompleteKenyanPhone = (value: string) =>
    value.startsWith("254") && value.length === 12;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!plotType) {
      showSnackbar("Please select a plot type", "warning");
      return;
    }

    if (plotType === "individual" && tenants.length === 0) {
      showSnackbar("Add at least one tenant", "warning");
      return;
    }

    // ✅ Phone validations before submit
    if (
      formData.caretakerPhone &&
      !isCompleteKenyanPhone(formData.caretakerPhone)
    ) {
      showSnackbar(
        "Caretaker phone number must be complete (254XXXXXXXXX)",
        "warning"
      );

      return;
    }
    if (plotType === "individual") {
      const missingAmount = tenants.some((t) => !t.amount);
      if (missingAmount) {
        showSnackbar("Each tenant must have a payment amount", "warning");
        return;
      }
    }

    if (
      plotType === "lumpsum" &&
      !isCompleteKenyanPhone(formData.mpesaNumber)
    ) {
      showSnackbar(
        "MPESA phone number must be complete (254XXXXXXXXX)",
        "warning"
      );
      return;
    }

    if (plotType === "individual") {
      const incompleteTenantPhones = tenants.some(
        (t) => !isCompleteKenyanPhone(t.phone)
      );

      if (incompleteTenantPhones) {
        showSnackbar(
          "All tenant phone numbers must be complete (254XXXXXXXXX)",
          "warning"
        );
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        showSnackbar("You must be logged in", "warning");
        return;
      }

      const idToken = await user.getIdToken();

      const payload = {
        plotType,
        ...formData,
        tenants: plotType === "individual" ? tenants : [],
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/plots/registerplot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      showSnackbar("Plot registered successfully", "success");

      setFormData({
        name: "",
        location: "",
        caretakerName: "",
        caretakerPhone: "",
        units: "",
        lumpsumExpected: "",
        mpesaNumber: "",
      });
      setTenants([]);
    } catch (err: any) {
      showSnackbar(err.message || "Something went wrong, try again", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatKenyanMobile = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);

    // Already formatted correctly
    if (digits.startsWith("254") && digits.length === 12) {
      return { value: digits, isValid: true };
    }

    // Still typing local number
    if (digits.startsWith("07") || digits.startsWith("01")) {
      if (digits.length < 10) {
        return { value: digits, isValid: true }; // don't warn while typing
      }

      return {
        value: `254${digits.slice(1)}`,
        isValid: true,
      };
    }

    // Empty field (no warning)
    if (digits.length === 0) {
      return { value: "", isValid: true };
    }

    // Invalid prefix
    return { value: digits, isValid: false };
  };

  const handlePhoneChange =
    (
      field: "caretakerPhone" | "mpesaNumber",
      validityKey: "caretaker" | "lumpsum"
    ) =>
    (value: string) => {
      const { value: formatted, isValid } = formatKenyanMobile(value);

      setFormData((prev) => ({ ...prev, [field]: formatted }));
      setPhoneValidity((prev) => ({ ...prev, [validityKey]: isValid }));
    };

  const handleTenantPhoneChange = (tenantId: string, value: string) => {
    const { value: formatted, isValid } = formatKenyanMobile(value);

    updateTenant(tenantId, "phone", formatted);

    setTenantPhoneValidity((prev) => ({
      ...prev,
      [tenantId]: isValid,
    }));
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
          <h1 className="text-3xl font-bold">Register New Plot</h1>
          <p className="text-muted-foreground">Add a new plot to the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
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
                  setFormData({
                    ...formData,
                    name: e.target.value.slice(0, 25),
                  })
                }
                maxLength={25}
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
                  setFormData({
                    ...formData,
                    location: e.target.value.slice(0, 30),
                  })
                }
                maxLength={30}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caretaker-name">
                  Caretaker Name{" "}
                  <span className="text-sm text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="caretaker-name"
                  placeholder="John Doe"
                  value={formData.caretakerName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      caretakerName: e.target.value.slice(0, 25),
                    })
                  }
                  maxLength={25}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caretaker-phone">
                  Caretaker Phone{" "}
                  <span className="text-sm text-muted-foreground">
                    (optional)
                  </span>
                </Label>

                <div className="relative">
                  <Input
                    id="caretaker-phone"
                    placeholder="0712345678"
                    value={formData.caretakerPhone}
                    onChange={(e) =>
                      handlePhoneChange(
                        "caretakerPhone",
                        "caretaker"
                      )(e.target.value)
                    }
                  />

                  {!phoneValidity.caretaker && (
                    <span className="absolute mt-1 text-xs text-amber-600">
                      Must start with <strong>07 , 01</strong>and have
                      <strong>10 digits</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plot Type */}
        <Card>
          <CardHeader>
            <CardTitle>Plot Type *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  plotType === "lumpsum"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setPlotType("lumpsum")}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={plotType === "lumpsum"}
                    onChange={() => setPlotType("lumpsum")}
                  />
                  <Badge
                    variant="secondary"
                    className="bg-teal-100 text-teal-800"
                  >
                    Lumpsum
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  One payment covers the entire plot
                </p>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  plotType === "individual"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setPlotType("individual")}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={plotType === "individual"}
                    onChange={() => setPlotType("individual")}
                  />
                  <Badge
                    variant="secondary"
                    className="bg-cyan-100 text-cyan-800"
                  >
                    Individual
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Each tenant pays individually
                </p>
              </div>
            </div>

            {/* Conditional Fields */}
            {plotType === "lumpsum" && (
              <div className="space-y-4 pt-4 border-t">
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
                      placeholder="5500"
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
                    <Label htmlFor="mpesa-number">
                      MPESA N.0 *{" "}
                      <span className="text-xs text-muted-foreground">
                        {" "}
                        (expected to make lumpsum payment)
                      </span>
                    </Label>

                    <Input
                      id="mpesa-number"
                      type="number"
                      placeholder="0712345678"
                      value={formData.mpesaNumber}
                      onChange={(e) =>
                        handlePhoneChange(
                          "mpesaNumber",
                          "lumpsum"
                        )(e.target.value)
                      }
                      required
                    />

                    {!phoneValidity.lumpsum && (
                      <span className="absolute mt-1 text-xs text-amber-600">
                        Must start with <strong>07 , 01</strong>and have
                        <strong>10 digits</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {plotType === "individual" && (
              <div className="space-y-4 pt-4 border-t">
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
                        <Label className="text-xs">Tenant Name *</Label>
                        <Input
                          placeholder="John Doe"
                          value={tenant.name}
                          onChange={(e) =>
                            updateTenant(tenant.id, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Tenant's MPESA N.O</Label>
                        <Input
                          type="number"
                          placeholder="0712345678"
                          value={tenant.phone}
                          onChange={(e) =>
                            handleTenantPhoneChange(tenant.id, e.target.value)
                          }
                        />

                        {tenantPhoneValidity[tenant.id] === false && (
                          <span className="absolute mt-1 text-xs text-amber-600">
                            Must start with <strong>07 , 01</strong>and have
                            <strong>10 digits</strong>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={tenant.amount}
                          onValueChange={(value) =>
                            updateTenant(tenant.id, "amount", value)
                          }
                        >
                          <SelectTrigger className="w-[90px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="100">100</SelectItem>
                            <SelectItem value="150">150</SelectItem>
                            <SelectItem value="200">200</SelectItem>
                            <SelectItem value="250">250</SelectItem>
                          </SelectContent>
                        </Select>

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

        <div className="flex gap-4">
          <Button type="submit" disabled={!plotType || isSubmitting}>
            {isSubmitting ? <CircularProgress size={20} /> : "Save Plot"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/plots")}
          >
            Cancel
          </Button>
        </div>
      </form>

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
