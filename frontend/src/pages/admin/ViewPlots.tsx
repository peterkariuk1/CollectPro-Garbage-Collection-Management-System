import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, MoreHorizontal, Edit, Trash2, FileText, Eye, Building2 } from "lucide-react";
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
import { mockPlots } from "@/data/mock-data";
import { PlotTypeBadge } from "@/components/plot-type-badge";

export function ViewPlots() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [plotToDelete, setPlotToDelete] = useState<string | null>(null);

  const filteredPlots = mockPlots.filter(plot =>
    plot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plot.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (plotId: string) => {
    setPlotToDelete(plotId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log("Delete plot:", plotToDelete);
    setDeleteDialogOpen(false);
    setPlotToDelete(null);
  };

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
          <Plus className="h-4 w-4 mr-2" />
          Register New Plot
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search plots..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Plots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlots.map((plot) => (
          <Card key={plot.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{plot.name}</CardTitle>
                    <PlotTypeBadge type={plot.type} />
                  </div>
                  <p className="text-sm text-muted-foreground">{plot.location}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/plot/${plot.id}`)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/admin/plots/${plot.id}/edit`)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Receipt
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(plot.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
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
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Expected:</span>
                <span className="font-medium">KES {plot.totalExpected.toLocaleString()}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Badge variant="outline" className="text-success">
                  Paid: KES {plot.totalPaid.toLocaleString()}
                </Badge>
                <Badge variant="outline" className="text-destructive">
                  Unpaid: KES {plot.totalUnpaid.toLocaleString()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlots.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No plots found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Get started by registering your first plot"}
          </p>
          <Button onClick={() => navigate("/admin/plots/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Register Plot
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this plot? This action cannot be undone.
              All associated tenants and payment records will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete and Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}