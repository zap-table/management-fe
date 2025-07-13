"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useBusiness } from "@/providers/business-provider";
import type { Business } from "@/types/businesses.types";
import type { Restaurant } from "@/types/restaurants.types";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Plus,
  Store,
} from "lucide-react";
import Link from "next/link";

interface BusinessRestaurantSelectorProps {
  showCreateActions?: boolean;
  showSidebarWrapper?: boolean;
}

function ReadOnlySelector({
  currentBusiness,
  currentRestaurant,
}: {
  currentBusiness: Business | null;
  currentRestaurant: Restaurant | null;
}) {
  if (!currentBusiness) return null;

  return (
    <div className="p-2 rounded-md border bg-card">
      <div className="space-y-2">
        {/* Business Level */}
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">
              {currentBusiness.name}
            </div>
          </div>
        </div>

        {/* Restaurant Level */}
        {currentRestaurant ? (
          <div className="flex items-center gap-2 pl-3 border-l-2 border-muted">
            <Store className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">
                {currentRestaurant.name}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {currentRestaurant.address}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-3 border-l-2 border-muted">
            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-muted-foreground">
                Nenhum restaurante selecionado
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InteractiveSelector({
  businesses,
  currentBusiness,
  currentRestaurant,
  getRestaurantsForBusiness,
  showCreateActions = true,
}: {
  businesses: Business[];
  currentBusiness: Business | null;
  currentRestaurant: Restaurant | null;
  getRestaurantsForBusiness: (id: number) => Restaurant[];
  showCreateActions?: boolean;
}) {
  const renderCurrentSelection = () => {
    if (!currentBusiness) {
      return (
        <Button
          variant="outline"
          className="w-full justify-between h-auto p-2 bg-transparent"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs">Escolha negócio / restaurante</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      );
    }

    const hasRestaurant = !!currentRestaurant;
    const restaurants = getRestaurantsForBusiness(currentBusiness.id);
    const hasAvailableRestaurants = restaurants.length > 0;

    return (
      <div
        className={cn(
          "p-2 rounded-md border bg-card cursor-pointer transition-colors hover:bg-accent/50",
          !hasRestaurant &&
            hasAvailableRestaurants &&
            "border-amber-200 bg-amber-50/50"
        )}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">
                {currentBusiness.name}
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Restaurant Level */}
          {hasRestaurant ? (
            <div className="flex items-center gap-2 pl-3 border-l-2 border-primary/20">
              <Store className="h-4 w-4 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {currentRestaurant.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {currentRestaurant.address}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-3 border-l-2 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">
                  {hasAvailableRestaurants
                    ? "Selecione um restaurante"
                    : "Nenhum restaurante disponivel"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {renderCurrentSelection()}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="start">
        {/* Quick Actions */}
        {showCreateActions && (
          <>
            <DropdownMenuLabel className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ações Rápidas
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/business/create">
                <Building2 className="h-4 w-4 mr-2" />
                Criar novo negócio
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Business Selection */}
        <DropdownMenuLabel className="flex items-center gap-2">
          Localização
        </DropdownMenuLabel>

        {businesses.map((business) => {
          const restaurants = getRestaurantsForBusiness(business.id);
          const isCurrentBusiness = currentBusiness?.id === business.id;

          return (
            <div key={business.id}>
              {/* Business Header */}
              <div className="px-2 py-1.5">
                <Link href={`/business/${business.id}`} className="block">
                  <div
                    className={cn(
                      "flex items-center gap-2 p-1 rounded-md hover:bg-accent transition-colors",
                      isCurrentBusiness && !currentRestaurant && "bg-accent"
                    )}
                  >
                    <Building2 className="h-4 w-4 text-primary" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {business.name}
                      </div>
                    </div>
                    {isCurrentBusiness && !currentRestaurant && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </Link>
              </div>

              {/* Restaurants */}
              {restaurants.length > 0 ? (
                <div className="ml-2 border-l border-muted pl-2 space-y-1">
                  {restaurants.map((restaurant) => (
                    <Link
                      key={restaurant.id}
                      href={`/business/${business.id}/restaurant/${restaurant.id}`}
                      className="block"
                    >
                      <DropdownMenuItem className="cursor-pointer">
                        <div className="flex items-center gap-3 w-full">
                          <Store className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {restaurant.name}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {restaurant.address}
                            </div>
                          </div>
                          {currentRestaurant?.id === restaurant.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </div>
              ) : null}

              {showCreateActions && (
                <div className="ml-2 border-l border-muted pl-2 mt-1">
                  <DropdownMenuItem
                    className="cursor-pointer text-muted-foreground"
                    asChild
                  >
                    <Link href={`/business/${business.id}/restaurant/create`}>
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="text-xs">
                        Criar restaurante no {business.name}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                </div>
              )}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function BusinessRestaurantSelector({
  showCreateActions = true,
  showSidebarWrapper = true,
}: BusinessRestaurantSelectorProps) {
  const { user, hasRole } = useAuth();
  const {
    businesses,
    isLoadingBusinesses,
    getRestaurantsForBusiness,
    currentBusiness,
    currentRestaurant,
  } = useBusiness();

  if (isLoadingBusinesses) {
    return <BusinessRestaurantSelectorSkeleton />;
  }

  if (!businesses || businesses.length === 0) {
    return (
      <div className="px-4 py-2  space-y-2">
        <div className="text-sm text-muted-foreground">
          Nenhum Negócio registado
        </div>
        {showCreateActions && (
          <Button variant="outline" size="sm" asChild>
            <Link href="/business/create">
              <Plus className="h-4 w-4 mr-2" />
              Registar negócio
            </Link>
          </Button>
        )}
      </div>
    );
  }

  const isReadOnly = !user || hasRole("staff");

  const content = isReadOnly ? (
    <ReadOnlySelector
      currentBusiness={currentBusiness}
      currentRestaurant={currentRestaurant}
    />
  ) : (
    <InteractiveSelector
      businesses={businesses}
      currentBusiness={currentBusiness}
      currentRestaurant={currentRestaurant}
      getRestaurantsForBusiness={getRestaurantsForBusiness}
      showCreateActions={showCreateActions}
    />
  );

  if (!showSidebarWrapper) {
    return content;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between px-0">
        <span>Negócio / Restaurante</span>
      </SidebarGroupLabel>
      <SidebarGroupContent>{content}</SidebarGroupContent>
    </SidebarGroup>
  );
}

function BusinessRestaurantSelectorSkeleton() {
  return (
    <div className="p-4">
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 ml-6"></div>
      </div>
    </div>
  );
}
