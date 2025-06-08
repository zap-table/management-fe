"use client";

import { LoginForm } from "@/components/login/login-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/providers/auth-provider";
import { useBusiness } from "@/providers/business-provider";
import {
  AlertCircle,
  Menu,
  Package,
  QrCode,
  ShoppingCart,
  Tags,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const { currentRestaurant } = useBusiness();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  if (!currentRestaurant) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center gap-2">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please select a restaurant to view the dashboard.
            </AlertDescription>
          </Alert>
        </div>
      </SidebarInset>
    );
  }

  const stats = [
    {
      title: "Categories",
      value: "12",
      description: "Active categories",
      icon: Tags,
      trend: "+2 this month",
    },
    {
      title: "Ingredients",
      value: "156",
      description: "Total ingredients",
      icon: Package,
      trend: "+12 this week",
    },
    {
      title: "Products",
      value: "89",
      description: "Menu items",
      icon: ShoppingCart,
      trend: "+5 this week",
    },
    {
      title: "Active Menus",
      value: "4",
      description: "Currently active",
      icon: Menu,
      trend: "2 seasonal",
    },
    {
      title: "Tables",
      value: "24",
      description: "Total tables",
      icon: QrCode,
      trend: "All configured",
    },
  ];

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <span className="text-sm text-muted-foreground">
            - {currentRestaurant.name}
          </span>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div className="flex items-center pt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest changes in {currentRestaurant.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      New product added: Grilled Salmon
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Menu updated: Summer Special
                    </p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Ingredient stock low: Fresh Basil
                    </p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks for {currentRestaurant.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <button className="flex items-center gap-2 p-2 text-left hover:bg-muted rounded-md">
                  <Package className="h-4 w-4" />
                  <span className="text-sm">Add new ingredient</span>
                </button>
                <button className="flex items-center gap-2 p-2 text-left hover:bg-muted rounded-md">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-sm">Create new product</span>
                </button>
                <button className="flex items-center gap-2 p-2 text-left hover:bg-muted rounded-md">
                  <Menu className="h-4 w-4" />
                  <span className="text-sm">Design new menu</span>
                </button>
                <button className="flex items-center gap-2 p-2 text-left hover:bg-muted rounded-md">
                  <QrCode className="h-4 w-4" />
                  <span className="text-sm">Generate table QR codes</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
