"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/auth-provider";
import { useBusiness } from "@/providers/business-provider";
import { Business } from "@/types/businesses.types";
import { Restaurant } from "@/types/restaurants.types";
import { Building2, ChevronDown, Store } from "lucide-react";
import Link from "next/link";

function ReadOnlySelector({
  currentBusiness,
  currentRestaurant,
}: {
  currentBusiness: Business | null;
  currentRestaurant: Restaurant | null;
}) {
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

function InteractiveSelector({
  businesses,
  currentBusiness,
  currentRestaurant,
  getRestaurantsForBusiness,
}: {
  businesses: Business[];
  currentBusiness: Business | null;
  currentRestaurant: Restaurant | null;
  getRestaurantsForBusiness: (id: number) => Restaurant[];
}) {
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
            <Link
              key={business.id}
              href={`/business/${business.id}`}
              className="flex flex-col items-start"
            >
              <div className="font-medium">{business.name}</div>
              <div className="text-xs text-muted-foreground">
                {business.description}
              </div>
            </Link>
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
              <Link
                key={restaurant.id}
                href={`/business/${currentBusiness.id}/restaurant/${restaurant.id}`}
                className="flex flex-col items-start"
              >
                <div className="font-medium">{restaurant.name}</div>
                <div className="text-xs text-muted-foreground">
                  {restaurant.address}
                </div>
              </Link>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export function BusinessRestaurantSelector() {
  const { user, hasRole } = useAuth();
  const {
    businesses,
    isLoadingBusinesses,
    getRestaurantsForBusiness,
    currentBusiness,
    currentRestaurant,
  } = useBusiness();

  if (isLoadingBusinesses) {
    return <>Loading</>;
  }

  if (!businesses) {
    return <>No business, please create one</>;
  }

  // Determine if user should see read-only or interactive selector
  const isReadOnly = !user || hasRole("staff");
  const canSelectBusiness = user && !hasRole("staff");

  if (isReadOnly) {
    return (
      <ReadOnlySelector
        currentBusiness={currentBusiness}
        currentRestaurant={currentRestaurant}
      />
    );
  }

  if (canSelectBusiness) {
    return (
      <InteractiveSelector
        businesses={businesses}
        currentBusiness={currentBusiness}
        currentRestaurant={currentRestaurant}
        getRestaurantsForBusiness={getRestaurantsForBusiness}
      />
    );
  }

  return null;
}
