import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PackageCheck, MessageCircle, ShoppingBag, Users, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const metrics = [
    {
      title: "Available Balance",
      value: "KSH 0",
      icon: CreditCard,
      description: "Total funds available",
    },
    {
      title: "Completed Orders",
      value: "0",
      icon: ShoppingBag,
      description: "Orders fulfilled",
    },
    {
      title: "Customers",
      value: "0",
      icon: Users,
      description: "Total customer base",
    },
    {
      title: "Sales",
      value: "KSH 0",
      icon: Users,
      description: "Total revenue",
    },
    {
      title: "Total Withdrawn",
      value: "KSH 0",
      icon: CreditCard,
      description: "Funds withdrawn",
    },
    {
      title: "Total Products",
      value: "0",
      icon: PackageCheck,
      description: "Active products",
    },
  ];

  const recentLeads: any[] = [];


  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>



      {/* Bottom Row: Data Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Sales / Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Recent orders from your store.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentLeads.length > 0 ? (
              <div className="space-y-8">
                {recentLeads.map((lead, index) => (
                  <div key={index} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{lead.initials}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {lead.time}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">{lead.amount}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <MessageCircle className="h-8 w-8 mb-2 opacity-50" />
                <p>No sales yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conversion Rate / Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
             <CardDescription>Store visitor conversion metrics.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <div className="relative h-40 w-40 flex items-center justify-center">
                    {/* Placeholder for a gauge or circular chart */}
                    <div className="absolute inset-0 rounded-full border-8 border-muted" />
                    <div className="absolute inset-0 rounded-full border-8 border-emerald-500 border-t-transparent rotate-45" />
                    <div className="text-2xl font-bold text-foreground">0%</div>
                </div>
                <p className="mt-4 text-sm">Visitor to Customer</p>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
