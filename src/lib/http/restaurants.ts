import { Restaurant } from "@/types/restaurants.types";
import { kyClient } from "../api-client";

export async function queryRestaurantById(
  restaurantId: string
): Promise<Restaurant> {
  try {
    const response = await kyClient.get<Restaurant>(
      `restaurant/${restaurantId}`
    );

    return response.json();
  } catch (error: unknown) {
    console.error("Failed to fetch restaurant:", error);
    throw error;
  }
}
