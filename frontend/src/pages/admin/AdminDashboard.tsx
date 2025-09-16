import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, DollarSign, TrendingUp } from "lucide-react";

export function AdminDashboard() {
  const stats = [
    {
      title: "Total Plots",
      value: "24",
      change: "+2 this month",
      icon: Building2,
      trend: "up"
    },
    {
      title: "Total Tenants", 
      value: "156",
      change: "+12 this month",
      icon: Users,
      trend: "up"
    },
    {
      title: "Monthly Revenue",
      value: "KES 105,800",
      change: "+8.2% from last month",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Collection Rate",
      value: "87.5%",
      change: "+3.1% from last month", 
      icon: TrendingUp,
      trend: "up"
    }
  ];

  const recentActivity = [
    { action: "New plot registered", details: "Plot C - Hunters Road", time: "2 hours ago" },
    { action: "Payment received", details: "Plot A - Unit 5 (KES 250)", time: "4 hours ago" },
    { action: "Tenant added", details: "John Doe - Plot B Unit 3", time: "6 hours ago" },
    { action: "Receipt generated", details: "Plot A - September 2025", time: "1 day ago" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your waste management operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-success">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                </div>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}