"use client";

import {
  CarrotIcon,
  CookingPot,
  HandPlatter,
  Home,
  LogOut,
  NotebookIcon,
  Receipt,
  Settings,
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
import { hasRole } from "@/lib/auth";
import { useBusiness } from "@/providers/business-provider";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { BusinessRestaurantSelector } from "./business-restaurant-selector";

const businessItems = (businessId: string) => [
  {
    title: "Categorias",
    url: `/business/${businessId}/categories`,
    icon: Tags,
  },
  {
    title: "Ingredientes",
    url: `/business/${businessId}/ingredients`,
    icon: CarrotIcon,
  },
  {
    title: "Refeições",
    url: `/business/${businessId}/meals`,
    icon: CookingPot,
  },
  {
    title: "Menus",
    url: `/business/${businessId}/menus`,
    icon: NotebookIcon,
  },
];

const restaurantItems = (businessId: string, restaurantId: string) => [
  {
    title: "Dashboard",
    url: `/business/${businessId}/restaurant/${restaurantId}`,
    icon: Home,
  },
  {
    title: "Mesas",
    url: `/business/${businessId}/restaurant/${restaurantId}/tables`,
    icon: TableIcon,
  },
  {
    title: "Pedidos",
    url: `/business/${businessId}/restaurant/${restaurantId}/orders`,
    icon: HandPlatter,
  },
];

export function AppSidebar() {
  const { data: session, status } = useSession();
  const { currentBusiness, currentRestaurant } = useBusiness();
  const pathname = usePathname();

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated" || !session) {
    return null;
  }

  const { user } = session;

  const showOwnerItems = hasRole(user, "owner");

  const hasBusinessSelected = !!currentBusiness;
  const hasBusinessAndRestaurantSelected =
    hasBusinessSelected && !!currentRestaurant;

  const signOutClick = async () => {
    await signOut({
      callbackUrl: `${window.location.origin}/sign-in`,
    });
  };

  const isActive = (pathname: string, url: string) => {
    if (url === "/") {
      return pathname === "/";
    }

    // Remove query params and trailing slashes
    const cleanPathname = pathname.split("?")[0].replace(/\/$/, "");
    const cleanUrl = url.split("?")[0].replace(/\/$/, "");

    return cleanPathname === cleanUrl;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Receipt className="h-4 w-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">Zap Table</span>
            <span className="text-xs text-muted-foreground">
              Gerir nunca foi tão rápido!
            </span>
          </div>
        </div>
      </SidebarHeader>

      <Separator />

      <BusinessRestaurantSelector />

      <SidebarContent className="gap-0">
        {showOwnerItems && hasBusinessSelected ? (
          <SidebarGroup className="py-0">
            <SidebarGroupLabel>Gestão do Negócio</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {businessItems(currentBusiness.id.toString()).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      disabled={!hasBusinessSelected}
                      isActive={isActive(pathname, item.url)}
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

        {hasBusinessAndRestaurantSelected ? (
          <SidebarGroup className="py-0">
            <SidebarGroupLabel>Gestão do restaurante</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {restaurantItems(
                  currentBusiness?.id.toString(),
                  currentRestaurant.id.toString()
                ).map((item) => (
                  // Disabled in case a restaurant is not selected
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(pathname, item.url)}
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
                <DropdownMenuItem onClick={() => signOutClick()}>
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
