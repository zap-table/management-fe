"use client";

import { queryUserBusinesses } from "@/actions/businesses.actions";
import { isOnAuthPage } from "@/lib/utils";
import { Business } from "@/types/businesses.types";
import { Restaurant } from "@/types/restaurants.types";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { createContext, useContext, useMemo } from "react";

interface BusinessContextType {
  businesses: Business[] | undefined;
  currentBusiness: Business | null;
  currentRestaurant: Restaurant | null;
  getRestaurantsForBusiness: (businessId: number) => Restaurant[];
  isLoadingBusinesses: boolean;
}

const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined
);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const { data: businesses, isLoading: isLoadingBusinesses } = useQuery<
    Business[]
  >({
    queryKey: ["businesses"],
    queryFn: async () => {
      return await queryUserBusinesses();
    },
    enabled: !isOnAuthPage(),
  });

  const pathname = usePathname();

  const { businessId, restaurantId } = parseBusinessRestaurantIds(pathname);

  const currentBusiness = useMemo(() => {
    if (!businesses || !businessId) return null;
    return (
      businesses.find((business) => business.id === Number(businessId)) ?? null
    );
  }, [businesses, businessId]);

  const currentRestaurant = useMemo(() => {
    if (!currentBusiness || !restaurantId) return null;
    return (
      currentBusiness.restaurants.find(
        (restaurant) => restaurant.id === Number(restaurantId)
      ) ?? null
    );
  }, [currentBusiness, restaurantId]);

  function getRestaurantsForBusiness(businessId: number): Restaurant[] {
    const business = businesses?.find((business) => business.id === businessId);

    if (!business) {
      return [];
    }

    return business.restaurants;
  }

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        isLoadingBusinesses,
        getRestaurantsForBusiness,
        currentBusiness,
        currentRestaurant,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

interface ParsedIds {
  businessId: string | null;
  restaurantId: string | null;
}

function parseBusinessRestaurantIds(path: string): ParsedIds {
  // Handle root path
  if (path === "/" || path === "") {
    return { businessId: null, restaurantId: null };
  }

  const segments = path.replace(/^\//, "").split("/").filter(Boolean);

  // Handle non-business paths
  if (segments[0] !== "business" || segments.length < 2) {
    return { businessId: null, restaurantId: null };
  }

  const businessId = segments[1];

  // Validate business ID is a number
  if (!businessId || isNaN(Number(businessId))) {
    return { businessId: null, restaurantId: null };
  }

  // Handle business-only path: /business/[id]
  if (segments.length === 2) {
    return { businessId, restaurantId: null };
  }

  // Handle restaurant path: /business/[id]/restaurant/[id]
  if (segments.length === 4 && segments[2] === "restaurant") {
    const restaurantId = segments[3];
    
    // Validate restaurant ID is a number
    if (!restaurantId || isNaN(Number(restaurantId))) {
      return { businessId, restaurantId: null };
    }
    
    return { businessId, restaurantId };
  }

  // For any other format, return business ID only
  return { businessId, restaurantId: null };
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
}
