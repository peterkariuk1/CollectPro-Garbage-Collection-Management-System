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
import { mockPlots } from "@/data/mock-data";

interface Tenant {
  id: string;
  name: string;
  phone: string;
}

export function EditPlot() {
  const navigate = useNavigate();
  const { plotId } = useParams();
  const [plotType, setPlotType] = useState<"lumpsum" | "individual" | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    caretakerName: "",
    caretakerPhone: "",
    units: "",
    lumpsumExpected: "",
    mpesaNumber: "",
    feePerTenant: "250"
  });

  // Load plot data
  useEffect(() => {
    const plot = mockPlots.find(p => p.id === plotId);
    if (plot) {
      setFormData({
        name: plot.name,
        location: plot.location,
        caretakerName: plot.caretakerName,
        caretakerPhone: plot.caretakerPhone,
        units: plot.units.toString(),
        lumpsumExpected: plot.type === "lumpsum" ? plot.totalExpected.toString() : "",
        mpesaNumber: plot.mpesaNumber || "",
        feePerTenant: plot.feePerTenant?.toString() || "250"
      });
      setPlotType(plot.type);
      
      // Mock tenants for individual plots
      if (plot.type === "individual") {
        setTenants([
          { id: "1", name: "John Doe", phone: "0712345678" },
          { id: "2", name: "Jane Smith", phone: "0787654321" },
        ]);
      }
    }
  }, [plotId]);


  const addTenant = () => {
    const newTenant: Tenant = {
      id: Date.now().toString(),
      name: "",
      phone: ""
    };
    setTenants([...tenants, newTenant]);
  };

  const updateTenant = (id: string, field: keyof Tenant, value: string) => {
    setTenants(tenants.map(tenant => 
      tenant.id === id ? { ...tenant, [field]: value } : tenant
    ));
  };

  const removeTenant = (id: string) => {
    setTenants(tenants.filter(tenant => tenant.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Update plot:", { ...formData, plotType, selectedImage, tenants });
    navigate("/admin/plots");
  };

  if (!mockPlots.find(p => p.id === plotId)) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Plot Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested plot could not be found.</p>
          <Button onClick={() => navigate("/admin/plots")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Plots
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/plots")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Plots
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Plot</h1>
          <p className="text-muted-foreground">Update plot information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
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
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Textarea
                id="location"
                placeholder="e.g., Hunters Road, Nairobi"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, caretakerName: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caretaker-phone">Caretaker Phone *</Label>
                <Input
                  id="caretaker-phone"
                  placeholder="0712345678"
                  value={formData.caretakerPhone}
                  onChange={(e) => setFormData({...formData, caretakerPhone: e.target.value})}
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
                <Badge variant="secondary" className="bg-teal-100 text-teal-800">Lumpsum</Badge>
              ) : (
                <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">Individual</Badge>
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
                      onChange={(e) => setFormData({...formData, units: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lumpsum-expected">Lumpsum Expected (KES) *</Label>
                    <Input
                      id="lumpsum-expected"
                      type="number"
                      placeholder="2500"
                      value={formData.lumpsumExpected}
                      onChange={(e) => setFormData({...formData, lumpsumExpected: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mpesa-number">MPESA Number</Label>
                    <Input
                      id="mpesa-number"
                      placeholder="0712345678"
                      value={formData.mpesaNumber}
                      onChange={(e) => setFormData({...formData, mpesaNumber: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {plotType === "individual" && (
              <div className="space-y-4 pt-4 border-t mt-4">
                <div className="space-y-2">
                  <Label htmlFor="fee-per-tenant">Fee per Tenant (KES) *</Label>
                  <Select value={formData.feePerTenant} onValueChange={(value) => setFormData({...formData, feePerTenant: value})}>
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
                    <Button type="button" variant="outline" size="sm" onClick={addTenant}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Tenant
                    </Button>
                  </div>

                  {tenants.map((tenant, index) => (
                    <div key={tenant.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                      <div className="space-y-1">
                        <Label className="text-xs">Tenant Name</Label>
                        <Input
                          placeholder="John Doe"
                          value={tenant.name}
                          onChange={(e) => updateTenant(tenant.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">MPESA Phone</Label>
                        <Input
                          placeholder="0712345678"
                          value={tenant.phone}
                          onChange={(e) => updateTenant(tenant.id, "phone", e.target.value)}
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
          <Button type="submit">
            Update Plot
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/plots")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}