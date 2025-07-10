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
import { useAuth } from "@/providers/auth-provider";
import { useBusiness } from "@/providers/business-provider";
import { Building2, ChevronDown, Store } from "lucide-react";

export function BusinessRestaurantSelector() {
  const { user, hasRole } = useAuth();

  const {
    businesses,
    isLoadingBusinesses,
    getRestaurantsForBusiness,
    currentBusiness,
    currentRestaurant,
    setCurrentBusiness,
    setCurrentRestaurant,
  } = useBusiness();

  if (isLoadingBusinesses) {
    return <>Loading</>;
  }

  if (!businesses) {
    return <>No business, please create one</>;
  }

  if (!user || hasRole("staff")) {
    return (
      <div className="p-2">
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{currentBusiness?.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm mt-1">
          <Store className="h-4 w-4 text-muted-foreground" />
          <span>{currentRestaurant?.name}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Business Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-between h-auto">
            <div className="flex items-center gap-2 text-left">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium text-sm">
                  {currentBusiness?.name || "Selecione o seu Négocio"}
                </div>
                {currentBusiness && (
                  <div className="text-xs text-muted-foreground">
                    {currentBusiness.description}
                  </div>
                )}
              </div>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuLabel>Selecione o sue Négocio</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {businesses.map((business) => (
            <DropdownMenuItem
              key={business.id}
              onClick={() => setCurrentBusiness(business)}
              className="flex flex-col items-start"
            >
              <div className="font-medium">{business.name}</div>
              <div className="text-xs text-muted-foreground">
                {business.description}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Restaurant Selector */}
      {currentBusiness && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between h-auto p-2"
            >
              <div className="flex items-center gap-2 text-left">
                <Store className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium text-sm">
                    {currentRestaurant?.name || "Select Restaurant"}
                  </div>
                  {currentRestaurant && (
                    <div className="text-xs text-muted-foreground">
                      {currentRestaurant.address}
                    </div>
                  )}
                </div>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuLabel>Selecione o restaurante</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {getRestaurantsForBusiness(currentBusiness.id).map((restaurant) => (
              <DropdownMenuItem
                key={restaurant.id}
                onClick={() => setCurrentRestaurant(restaurant)}
                className="flex flex-col items-start"
              >
                <div className="font-medium">{restaurant.name}</div>
                <div className="text-xs text-muted-foreground">
                  {restaurant.address}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
