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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Tenant {
  id: string;
  name: string;
  phone: string;
}

export function RegisterPlot() {
  const navigate = useNavigate();
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("File size must be less than 5MB");
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

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
    console.log("Form data:", { ...formData, plotType, selectedImage, tenants });
    navigate("/admin/plots");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/plots")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Plots
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Register New Plot</h1>
          <p className="text-muted-foreground">Add a new plot to the system</p>
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

        {/* Plot Type */}
        <Card>
          <CardHeader>
            <CardTitle>Plot Type *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  plotType === "lumpsum" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setPlotType("lumpsum")}
              >
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    checked={plotType === "lumpsum"} 
                    onChange={() => setPlotType("lumpsum")}
                  />
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800">Lumpsum</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  One payment covers the entire plot
                </p>
              </div>

              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  plotType === "individual" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setPlotType("individual")}
              >
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    checked={plotType === "individual"} 
                    onChange={() => setPlotType("individual")}
                  />
                  <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">Individual</Badge>
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
              <div className="space-y-4 pt-4 border-t">
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

        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Plot Image</CardTitle>
          </CardHeader>
          <CardContent>
            {!imagePreview ? (
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <span className="text-primary hover:underline">Click to upload</span> or drag and drop
                  </Label>
                  <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                </div>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Plot preview" 
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={!plotType}>
            Save Plot
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/plots")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}