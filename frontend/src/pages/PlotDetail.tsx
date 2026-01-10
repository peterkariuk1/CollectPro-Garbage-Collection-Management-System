import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { PlotTypeBadge } from "@/components/plot-type-badge";

import {
  ArrowLeft,
  MapPin,
  Phone,
  Download,
  FileText,
  Building2,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import loaderSVG from "../assets/loader.svg";

export default function PlotDetail() {
  const { plotId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const backTo = location.state?.from || "/dashboard";

  const [plot, setPlot] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlot = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const token = await user.getIdToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/plots/${plotId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();
        if (res.ok) setPlot(data.plot);
      } catch (err) {
        console.error("FETCH PLOT ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlot();
  }, [plotId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <img className="w-[100px]" src={loaderSVG} alt="loading" />
      </div>
    );
  }

  if (!plot) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Plot Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The plot you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate(backTo)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  const tenants = plot.tenants || [];

  // Safe derived values (backend does not provide payments yet)
  const totalPaid = plot.totalPaid ?? 0;
  const totalExpected =
    plot.plotType === "lumpsum"
      ? plot.lumpsumExpected ?? 0
      : tenants.length * (plot.feePerTenant ?? 0);
  const totalUnpaid = totalExpected - totalPaid;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Back button */}
        <div>
          <Button variant="outline" onClick={() => navigate(backTo)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Plot info */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">{plot.name}</h1>

          <div className="flex flex-col gap-2 mt-2 text-muted-foreground md:flex-row md:items-center md:gap-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {plot.location}
            </div>

            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {plot.caretakerName || "N/A"} – {plot.caretakerPhone || "N/A"}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Generate Receipt
          </Button>

          <Button variant="outline" className="w-full sm:w-auto">
            <FileText className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Plot Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plot Info */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Plot Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Type:</span>
              <PlotTypeBadge type={plot.plotType} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Units:</span>
              <span className="font-medium">{plot.units}</span>
            </div>

            {plot.plotType === "lumpsum" && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Lumpsum Expected:
                </span>
                <span className="font-medium">
                  KES {plot.lumpsumExpected?.toLocaleString()}
                </span>
              </div>
            )}

            {plot.feePerTenant && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Fee per Tenant:
                </span>
                <span className="font-medium">KES {plot.feePerTenant}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Summary */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-green-600">Revenue Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Total Expected:
              </span>
              <span className="font-medium">
                KES {totalExpected.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-600">Total Paid:</span>
              <span className="font-medium text-green-600">
                KES {totalPaid.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-red-600">Total Unpaid:</span>
              <span className="font-medium text-red-600">
                KES {totalUnpaid.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all"
                style={{
                  width:
                    totalExpected === 0
                      ? "0%"
                      : `${(totalPaid / totalExpected) * 100}%`,
                }}
              />
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {totalExpected === 0
                ? "0%"
                : Math.round((totalPaid / totalExpected) * 100)}
              % Collected
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions — unchanged */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Contact Caretaker
            </Button>
            <Button className="w-full" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            <Button className="w-full" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Send Reminder
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tenants Table */}
      {plot.plotType === "individual" && tenants.length > 0 && (
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Tenant Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Amount Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Paid</TableHead>
                  <TableHead>MPESA Ref</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>{tenant.phone}</TableCell>
                    <TableCell>KES {plot.feePerTenant ?? "N/A"}</TableCell>
                    <TableCell>
                      <StatusBadge status="unpaid" />
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="font-mono text-sm">-</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Lumpsum Info */}
      {plot.plotType === "lumpsum" && (
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Lumpsum Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Expected Amount
                </div>
                <div className="text-2xl font-bold">
                  KES {plot.lumpsumExpected?.toLocaleString()}
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Amount Received
                </div>
                <div className="text-2xl font-bold text-green-600">
                  KES {totalPaid.toLocaleString()}
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">
                  MPESA Number
                </div>
                <div className="font-mono">{plot.mpesaNumber}</div>
              </div>
            </div>
            <div className="flex justify-center">
              <StatusBadge
                status={
                  totalPaid >= (plot.lumpsumExpected || 0) ? "paid" : "unpaid"
                }
                size="md"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
