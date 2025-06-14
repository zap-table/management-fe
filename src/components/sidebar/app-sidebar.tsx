"use client";

import {
  Building2,
  CarrotIcon,
  ChefHat,
  CookingPot,
  HandPlatter,
  Home,
  LogOut,
  NotebookIcon,
  Settings,
  Store,
  TableIcon,
  Tags,
  User,
} from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/providers/auth-provider";
import { useBusiness } from "@/providers/business-provider";
import { usePathname } from "next/navigation";
import { BusinessRestaurantSelector } from "../business/business-restaurant-selector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";

const ownerMenuItems = [
  {
    title: "Négocios",
    url: "/businesses",
    icon: Building2,
  },
  {
    title: "Restaurantes",
    url: "/restaurants",
    icon: Store,
  },
];

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Categorias",
    url: "/categories",
    icon: Tags,
  },
  {
    title: "Ingredientes",
    url: "/ingredients",
    icon: CarrotIcon,
  },
  {
    title: "Refeições",
    url: "/meals",
    icon: CookingPot,
  },
  {
    title: "Menus",
    url: "/menus",
    icon: NotebookIcon,
  },
  {
    title: "Mesas",
    url: "/tables",
    icon: TableIcon,
  },
  {
    title: "Pedidos",
    url: "/requests",
    icon: HandPlatter,
  },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { currentRestaurant } = useBusiness();
  const pathname = usePathname();

  if (!user) {
    return null;
  }

  const showOwnerItems = user.role === "owner";
  const hasRestaurantSelected = !!currentRestaurant;

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(url);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <ChefHat className="h-6 w-6" />
          <span className="font-semibold text-lg">Zap Table</span>
        </div>
        <BusinessRestaurantSelector />
      </SidebarHeader>

      <Separator />

      <SidebarContent className="gap-0">
        {showOwnerItems ? (
          <SidebarGroup className="py-0">
            <SidebarGroupLabel>Gestão do Negócio</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {ownerMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      disabled={!hasRestaurantSelected}
                      isActive={isActive(item.url)}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        <SidebarGroup className="py-0">
          <SidebarGroupLabel>Gestão do restaurante</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User />
                  <span>{user.name}</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="top" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Definições
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
