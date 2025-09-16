import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/status-badge"
import { PlotTypeBadge } from "@/components/plot-type-badge"
import { mockPlots, mockTenants } from "@/data/mock-data"
import { ArrowLeft, MapPin, Phone, Download, FileText, Building2 } from "lucide-react"

export default function PlotDetail() {
  const { plotId } = useParams()
  const navigate = useNavigate()
  
  const plot = mockPlots.find(p => p.id === plotId)
  const tenants = mockTenants.filter(t => t.plotId === plotId)
  
  if (!plot) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Plot Not Found</h2>
          <p className="text-muted-foreground mb-4">The plot you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{plot.name}</h1>
          <div className="flex items-center gap-4 mt-2 text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {plot.location}
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {plot.caretakerName} - {plot.caretakerPhone}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Generate Receipt
          </Button>
          <Button variant="outline">
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
              <PlotTypeBadge type={plot.type} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Units:</span>
              <span className="font-medium">{plot.units}</span>
            </div>
            {plot.type === "lumpsum" && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Lumpsum Expected:</span>
                <span className="font-medium">KES {plot.lumpsumExpected?.toLocaleString()}</span>
              </div>
            )}
            {plot.feePerTenant && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Fee per Tenant:</span>
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
              <span className="text-sm text-muted-foreground">Total Expected:</span>
              <span className="font-medium">KES {plot.totalExpected.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-600">Total Paid:</span>
              <span className="font-medium text-green-600">KES {plot.totalPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-red-600">Total Unpaid:</span>
              <span className="font-medium text-red-600">KES {plot.totalUnpaid.toLocaleString()}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all"
                style={{ width: `${(plot.totalPaid / plot.totalExpected) * 100}%` }}
              />
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {Math.round((plot.totalPaid / plot.totalExpected) * 100)}% Collected
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
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

      {/* Tenants Table (for Individual plots) */}
      {plot.type === "individual" && tenants.length > 0 && (
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
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>{tenant.phone}</TableCell>
                    <TableCell>KES {tenant.fee}</TableCell>
                    <TableCell>
                      <StatusBadge status={tenant.status} />
                    </TableCell>
                    <TableCell>
                      {tenant.datePaid ? new Date(tenant.datePaid).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {tenant.mpesaRef || '-'}
                    </TableCell>
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

      {/* Lumpsum Payment Info */}
      {plot.type === "lumpsum" && (
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Lumpsum Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">Expected Amount</div>
                <div className="text-2xl font-bold">KES {plot.lumpsumExpected?.toLocaleString()}</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">Amount Received</div>
                <div className="text-2xl font-bold text-green-600">KES {plot.totalPaid.toLocaleString()}</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">MPESA Number</div>
                <div className="font-mono">{plot.mpesaNumber}</div>
              </div>
            </div>
            <div className="flex justify-center">
              <StatusBadge status={plot.totalPaid >= (plot.lumpsumExpected || 0) ? "paid" : "unpaid"} size="md" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}