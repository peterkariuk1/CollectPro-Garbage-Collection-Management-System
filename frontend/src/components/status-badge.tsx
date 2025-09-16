import { CheckCircle, XCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type PaymentStatus = "paid" | "unpaid" | "pending"

interface StatusBadgeProps {
  status: PaymentStatus
  size?: "sm" | "md"
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const variants = {
    paid: {
      className: "status-paid",
      icon: CheckCircle,
      text: "Paid"
    },
    unpaid: {
      className: "status-unpaid", 
      icon: XCircle,
      text: "Unpaid"
    },
    pending: {
      className: "status-pending",
      icon: Clock,
      text: "Pending"
    }
  }

  const variant = variants[status]
  const Icon = variant.icon

  return (
    <Badge 
      className={cn(
        variant.className,
        "flex items-center gap-1 font-medium",
        size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1.5"
      )}
    >
      <Icon className={cn(
        size === "sm" ? "h-3 w-3" : "h-4 w-4"
      )} />
      {variant.text}
    </Badge>
  )
}