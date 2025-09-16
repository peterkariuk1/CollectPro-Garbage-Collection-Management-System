import heroVideo from "@/assets/bgvid.mp4";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Building2, Users, Percent } from "lucide-react";
import { getMonthlysummary } from "@/data/mock-data"
import { motion } from "framer-motion";

export  function MonthlySummary() {
    const summary = getMonthlysummary()
  
  return (
    <motion.div
      className="relative w-full h-[300px] rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Background Video */}
      <video
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[1px]" />

      {/* Glassmorphic Card */}
      <Card className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 
        bg-white/4 dark:bg-black/20 backdrop-blur-[15px] border border-white/20 shadow-xl
        rounded-2xl transition-all duration-500 hover:scale-[1.02]">
        
        <CardHeader className="pb-3 text-center">
          <CardTitle className="text-white flex items-center gap-2 text-xl font-bold">
            <TrendingUp className="h-5 w-5" />
            Monthly Revenue Summary
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 w-full text-center">
          {/* Main Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="revenue-large text-4xl font-extrabold text-white mb-2">
              KES {summary.totalRevenue.toLocaleString()}
            </div>
            <div className="text-white/80 text-sm flex flex-wrap items-center justify-center gap-4">
              <span className="text-green-400 font-medium">
                Collected: KES {summary.totalPaid.toLocaleString()}
              </span>
              <span className="text-red-400 font-medium">
                Unpaid: KES {summary.totalUnpaid.toLocaleString()}
              </span>
              <span className="text-muted-foreground font-medium">
                Expected: KES {summary.totalExpected.toLocaleString()}
              </span>
            </div>
          </motion.div>

          {/* KPI Chips */}
          <motion.div
            className="flex flex-wrap gap-3 justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
          >
            <Badge className="bg-white/20 dark:bg-white/10 text-white border border-white/30 hover:bg-white/30">
              <Building2 className="h-3 w-3 mr-1" />
              {summary.totalPlots} Plots
            </Badge>
            <Badge className="bg-white/20 dark:bg-white/10 text-white border border-white/30 hover:bg-white/30">
              <Users className="h-3 w-3 mr-1" />
              {summary.totalUnits} Units
            </Badge>
            <Badge className="bg-white/20 dark:bg-white/10 text-white border border-white/30 hover:bg-white/30">
              <Percent className="h-3 w-3 mr-1" />
              {summary.collectionRate}% Collected
            </Badge>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
