import { Table } from "@/types/tables.types";
import { kyClient } from "../api-client";

export async function queryTableById(tableId: string): Promise<Table> {
  try {
    const response = await kyClient.get<Table>(`table/${tableId}`);

    return response.json();
  } catch (error: unknown) {
    console.error("Failed to fetch table:", error);
    throw error;
  }
}

export async function queryTablesByBusinessAndRestaurantId(
  businessId: string,
  restaurantId: string
): Promise<Table[]> {
  try {
    const response = await kyClient.get<Table[]>(
      `business/${businessId}/restaurant/${restaurantId}/table`
    );

    return response.json();
  } catch (error: unknown) {
    console.error("Failed to fetch tables:", error);
    throw error;
  }
}
