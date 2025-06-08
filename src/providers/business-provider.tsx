"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-provider";

interface Business {
  id: string;
  name: string;
  description: string;
  ownerId: string;
}

interface Restaurant {
  id: string;
  name: string;
  address: string;
  businessId: string;
  phone: string;
}

interface BusinessContextType {
  businesses: Business[];
  restaurants: Restaurant[];
  currentBusiness: Business | null;
  currentRestaurant: Restaurant | null;
  setCurrentBusiness: (business: Business | null) => void;
  setCurrentRestaurant: (restaurant: Restaurant | null) => void;
  getRestaurantsForBusiness: (businessId: string) => Restaurant[];
  canAccessRestaurant: (restaurantId: string) => boolean;
}

const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined
);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentBusiness, setCurrentBusinessState] = useState<Business | null>(
    null
  );
  const [currentRestaurant, setCurrentRestaurantState] =
    useState<Restaurant | null>(null);

  // Mock data
  const mockBusinesses: Business[] = [
    {
      id: "1",
      name: "Delicious Dining Group",
      description: "Premium restaurant chain",
      ownerId: "1",
    },
    {
      id: "2",
      name: "Fast Food Empire",
      description: "Quick service restaurants",
      ownerId: "1",
    },
  ];

  const mockRestaurants: Restaurant[] = [
    {
      id: "1",
      name: "Downtown Bistro",
      address: "123 Main St",
      businessId: "1",
      phone: "+1-555-0101",
    },
    {
      id: "2",
      name: "Uptown Grill",
      address: "456 Oak Ave",
      businessId: "1",
      phone: "+1-555-0102",
    },
    {
      id: "3",
      name: "Quick Burger",
      address: "789 Pine St",
      businessId: "2",
      phone: "+1-555-0201",
    },
    {
      id: "4",
      name: "Speedy Pizza",
      address: "321 Elm St",
      businessId: "2",
      phone: "+1-555-0202",
    },
  ];

  useEffect(() => {
    if (user) {
      if (user.role === "owner") {
        // Owners can see all their businesses
        const userBusinesses = mockBusinesses.filter(
          (b) => b.ownerId === user.id
        );
        setBusinesses(userBusinesses);
        setRestaurants(mockRestaurants);

        // Restore previous selections
        const savedBusiness = localStorage.getItem("currentBusiness");
        const savedRestaurant = localStorage.getItem("currentRestaurant");

        if (savedBusiness) {
          const business = JSON.parse(savedBusiness);
          if (userBusinesses.find((b) => b.id === business.id)) {
            setCurrentBusinessState(business);
          }
        }

        if (savedRestaurant) {
          const restaurant = JSON.parse(savedRestaurant);
          if (mockRestaurants.find((r) => r.id === restaurant.id)) {
            setCurrentRestaurantState(restaurant);
          }
        }
      } else if (user.role === "staff") {
        // Staff can only see their assigned restaurant
        if (user.businessId && user.restaurantId) {
          const business = mockBusinesses.find((b) => b.id === user.businessId);
          const restaurant = mockRestaurants.find(
            (r) => r.id === user.restaurantId
          );

          if (business && restaurant) {
            setBusinesses([business]);
            setRestaurants([restaurant]);
            setCurrentBusinessState(business);
            setCurrentRestaurantState(restaurant);
          }
        }
      }
    } else {
      setBusinesses([]);
      setRestaurants([]);
      setCurrentBusinessState(null);
      setCurrentRestaurantState(null);
    }
  }, [user]);

  const setCurrentBusiness = (business: Business | null) => {
    setCurrentBusinessState(business);
    setCurrentRestaurantState(null); // Reset restaurant when business changes

    if (business) {
      localStorage.setItem("currentBusiness", JSON.stringify(business));
    } else {
      localStorage.removeItem("currentBusiness");
    }
    localStorage.removeItem("currentRestaurant");
  };

  const setCurrentRestaurant = (restaurant: Restaurant | null) => {
    setCurrentRestaurantState(restaurant);

    if (restaurant) {
      localStorage.setItem("currentRestaurant", JSON.stringify(restaurant));
    } else {
      localStorage.removeItem("currentRestaurant");
    }
  };

  const getRestaurantsForBusiness = (businessId: string) => {
    return restaurants.filter((r) => r.businessId === businessId);
  };

  const canAccessRestaurant = (restaurantId: string) => {
    if (user?.role === "owner") {
      return true; // Owners can access all restaurants in their businesses
    }

    if (user?.role === "staff") {
      return user.restaurantId === restaurantId;
    }

    return false;
  };

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        restaurants,
        currentBusiness,
        currentRestaurant,
        setCurrentBusiness,
        setCurrentRestaurant,
        getRestaurantsForBusiness,
        canAccessRestaurant,
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
