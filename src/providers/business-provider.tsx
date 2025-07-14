"use client";

import { queryUserBusinesses } from "@/actions/businesses.actions";
import { getBusinessRestaurantIdsClient } from "@/lib/business";
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

  const { businessId, restaurantId } = getBusinessRestaurantIdsClient(pathname);
  console.log(businessId, restaurantId);

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

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
}
