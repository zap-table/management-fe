"use client";

import { queryUserBusinesses } from "@/actions/businesses.actions";
import { Business } from "@/types/businesses.types";
import { Restaurant } from "@/types/restaurants.types";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./auth-provider";

interface BusinessContextType {
  businesses: Business[] | undefined;
  currentBusiness: Business | null;
  currentRestaurant: Restaurant | null;
  getRestaurantsForBusiness: (businessId: number) => Restaurant[];
  isLoadingBusinesses: boolean;
  setCurrentBusiness: (business: Business | null) => void;
  setCurrentRestaurant: (restaurant: Restaurant | null) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined
);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const { data: businesses, isLoading: isLoadingBusinesses } = useQuery<
    Business[]
  >({
    queryKey: [`user-${user?.id}`, "business"],
    queryFn: async () => {
      return await queryUserBusinesses();
    },
  });

  const [currentBusiness, setCurrentBusinessState] = useState<Business | null>(
    null
  );

  const [currentRestaurant, setCurrentRestaurantState] =
    useState<Restaurant | null>(null);

  const setCurrentBusiness = (business: Business | null) => {
    setCurrentBusinessState(business);
    setCurrentRestaurantState(null);
  };

  const setCurrentRestaurant = (restaurant: Restaurant | null) => {
    setCurrentRestaurantState(restaurant);
  };

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
        setCurrentBusiness,
        setCurrentRestaurant,
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
