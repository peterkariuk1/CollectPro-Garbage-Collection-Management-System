import { useState } from "react";
import { Download, Printer, FileText, Filter, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockPlots } from "@/data/mock-data";

// Mock receipts data
const mockReceipts = [
  {
    id: "RCP-001",
    plotName: "Plot A",
    tenantName: "John Doe",
    amount: 250,
    month: "September",
    year: "2025",
    generatedAt: "2025-09-15",
    type: "individual" as const,
  },
  {
    id: "RCP-002",
    plotName: "Plot B",
    tenantName: null,
    amount: 2500,
    month: "September",
    year: "2025",
    generatedAt: "2025-09-14",
    type: "lumpsum" as const,
  },
  {
    id: "RCP-003",
    plotName: "Plot A",
    tenantName: "Jane Smith",
    amount: 250,
    month: "August",
    year: "2025",
    generatedAt: "2025-08-30",
    type: "individual" as const,
  },
];

export function Receipts() {
  const [selectedMonth, setSelectedMonth] = useState("september");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedPlot, setSelectedPlot] = useState("all");
  const [activeSection, setActiveSection] = useState<"receipts" | "generate">(
    "receipts"
  );

  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const years = ["2023", "2024", "2025"];

  const filteredReceipts = mockReceipts.filter((receipt) => {
    const monthMatch =
      selectedMonth === "all" || receipt.month.toLowerCase() === selectedMonth;
    const yearMatch = selectedYear === "all" || receipt.year === selectedYear;
    const plotMatch =
      selectedPlot === "all" || receipt.plotName === selectedPlot;
    return monthMatch && yearMatch && plotMatch;
  });

  const handleGeneratePDF = (type: "individual" | "plot" | "full") => {
    console.log(`Generating ${type} receipt PDF...`);
    // This would trigger PDF generation
  };

  const handleDownloadCSV = () => {
    console.log("Downloading CSV...");
    // This would trigger CSV download
  };

  const handleDownloadReport = () => {
    console.log("Downloading full report...");
    // This would trigger full report download
  };

  const handlePrintReceipt = (receiptId: string) => {
    console.log("Printing receipt:", receiptId);
    // This would trigger print functionality
  };

  return (
    <div className="p-6 space-y-6 md:w-full w-[88vw]">
      <div>
        <h1 className="text-3xl font-bold">Receipts & Exports</h1>
        <p className="text-muted-foreground">
          Generate and download receipts and reports
        </p>
      </div>

      {/* Filters — UNTOUCHED */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month.charAt(0).toUpperCase() + month.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Plot</Label>
              <Select value={selectedPlot} onValueChange={setSelectedPlot}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plots</SelectItem>
                  {mockPlots.map((plot) => (
                    <SelectItem key={plot.id} value={plot.name}>
                      {plot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="opacity-0">Actions</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMonth("all")}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate New Receipts (collapsed by default) */}
      <Card>
        <CardHeader
          className="cursor-pointer p-4 flex flex-row items-center gap-2"
          onClick={() => setActiveSection("generate")}
        >
          <CardTitle>Generate New Receipts</CardTitle>
          {activeSection !== "generate" ? <Expand /> : ""}
        </CardHeader>

        {activeSection === "generate" ? (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => handleGeneratePDF("plot")}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <FileText className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Plot Receipt</div>
                  <div className="text-xs opacity-80">For entire plot</div>
                </div>
              </Button>

              <Button
                onClick={() => handleGeneratePDF("full")}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <FileText className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Full Report</div>
                  <div className="text-xs opacity-80">
                    Download as PDF or EXCEL
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Generate new receipts and downloadable reports.
            </p>
          </CardContent>
        )}
      </Card>

      {/* Receipts (OPEN by default) */}
      <Card>
        <CardHeader
          className="cursor-pointer p-4 flex flex-row items-center gap-2"
          onClick={() => setActiveSection("receipts")}
        >
          <CardTitle>Receipts</CardTitle>
          {activeSection !== "receipts" ? <Expand /> : ""}
        </CardHeader>

        {activeSection === "receipts" ? (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt ID</TableHead>
                  <TableHead>Plot</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell>
                      <div className="font-mono text-sm">{receipt.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{receipt.plotName}</div>
                    </TableCell>
                    <TableCell>
                      {receipt.tenantName ? (
                        receipt.tenantName
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-teal-100 text-teal-800"
                        >
                          Lumpsum
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        KES {receipt.amount.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {receipt.month} {receipt.year}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {receipt.generatedAt}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrintReceipt(receipt.id)}
                        >
                          <Printer className="h-3 w-3 mr-1" />
                          Print
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredReceipts.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No receipts found</h3>
                <p className="text-muted-foreground">
                  No receipts have been generated yet
                </p>
              </div>
            )}
          </CardContent>
        ) : (
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View, print, and download generated receipts.
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
