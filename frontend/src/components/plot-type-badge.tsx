import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type PlotType = "lumpsum" | "individual"

interface PlotTypeBadgeProps {
  type: PlotType
  size?: "sm" | "md"
}

export function PlotTypeBadge({ type, size = "sm" }: PlotTypeBadgeProps) {
  const variants = {
    lumpsum: {
      className: "plot-lumpsum",
      text: "Lumpsum"
    },
    individual: {
      className: "plot-individual",
      text: "Individual"
    }
  }

  const variant = variants[type]

  return (
    <Badge 
      className={cn(
        variant.className,
        "font-medium",
        size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1.5"
      )}
    >
      {variant.text}
    </Badge>
  )
}