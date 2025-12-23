import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlotTypeBadge } from "@/components/plot-type-badge";
import {
  MapPin,
  Phone,
  MoreVertical,
  Eye,
  Download,
  Edit,
  Trash2,
  Building2,
} from "lucide-react";
import { Plot } from "@/data/mock-data";
import { useNavigate } from "react-router-dom";

interface PlotCardProps {
  plot: Plot;
}

export function PlotCard({ plot }: PlotCardProps) {
  const navigate = useNavigate();

  const handleContact = () => {
    window.open(`tel:${plot.caretakerPhone}`);
  };

  const handleViewDetails = () => {
    navigate(`/plot/${plot.id}`);
  };

  return (
    <Card className="card-elevated transition-smooth hover:shadow-lg hover:scale-[1.02] cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image/Icon */}
          <div className="flex-shrink-0">
            {plot.image ? (
              <img
                src={plot.image}
                alt={plot.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header with type badge */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <PlotTypeBadge type={plot.type} />
                <h3 className="font-semibold text-lg mt-1 mb-1 group-hover:text-primary transition-colors">
                  {plot.name}
                </h3>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleViewDetails}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Generate Receipt
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate(`/admin/plots/${plot.id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Plot
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Plot
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Location and Contact */}
            <div className="space-y-1 mb-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                {plot.location}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-3 w-3 mr-1" />
                  {plot.caretakerName}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleContact}
                  className="h-6 px-2 text-xs"
                >
                  Contact
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Units: {plot.units}
              </div>
            </div>

            {/* Revenue Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium">
                  Paid: KES {plot.totalPaid.toLocaleString()}
                </span>
                <span className="text-red-600 font-medium">
                  Unpaid: KES {plot.totalUnpaid.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Total Expected: KES {plot.totalExpected.toLocaleString()}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(plot.totalPaid / plot.totalExpected) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
