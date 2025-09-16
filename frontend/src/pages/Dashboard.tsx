import { useState } from "react"
import { MonthlySummary } from "@/components/dashboard/monthly-summary"
import { PlotCard } from "@/components/dashboard/plot-card"
import { mockPlots, Plot } from "@/data/mock-data"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  
  const filteredPlots = mockPlots.filter(plot =>
    plot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plot.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Monthly Summary */}
      <MonthlySummary />

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search plots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Plots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlots.map((plot) => (
          <PlotCard key={plot.id} plot={plot} />
        ))}
      </div>

      {filteredPlots.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            No plots found. Try adjusting your search.
          </div>
        </div>
      )}
    </div>
  )
}