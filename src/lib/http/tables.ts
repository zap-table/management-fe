import {
  ChangeTableStatusRequest,
  Table,
  UpdateTable,
  UpdateTableRequest,
} from "@/types/tables.types";
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
    const requestPromise = kyClient
      .get<Table[]>(`business/${businessId}/restaurant/${restaurantId}/table`)
      .json();

    const result = await requestPromise;
    return result;
  } catch (error: unknown) {
    // Remove from cache on error
    console.error("Failed to fetch tables:", error);
    throw error;
  }
}

export async function mutateCreateTable({
  restaurantId,
  createTable,
}: {
  restaurantId: number;
  createTable: UpdateTable;
}): Promise<void> {
  try {
    const requestBody = {
      ...createTable,
      restaurantId,
    };

    await kyClient.post(`table`, {
      body: JSON.stringify(requestBody),
    });
  } catch (error: unknown) {
    console.error("Failed to create table:", error);
    throw error;
  }
}

export async function mutateUpdateTable({
  tableId,
  updateTable,
}: {
  tableId: number;
  updateTable: UpdateTableRequest;
}): Promise<void> {
  try {
    await kyClient.put(`table/${tableId}`, {
      body: JSON.stringify(updateTable),
    });
  } catch (error: unknown) {
    console.error("Failed to update table:", error);
    throw error;
  }
}

export async function mutateChangeTableStatus(
  tableId: number,
  body: ChangeTableStatusRequest
): Promise<void> {
  try {
    await kyClient.patch(`table/${tableId}/status`, {
      json: body,
    });
  } catch (error: unknown) {
    console.error("Failed to update table status:", error);
    throw error;
  }
}

export async function mutateUpdateTableInformation(
  tableId: number,
  body: UpdateTableRequest
): Promise<void> {
  try {
    await kyClient.patch(`table/${tableId}`, {
      json: body,
    });
  } catch (error: unknown) {
    console.error("Failed to update table status:", error);
    throw error;
  }
}

export async function mutateDeleteTable(tableId: number): Promise<void> {
  try {
    await kyClient.delete(`table/${tableId}`);
  } catch (error: unknown) {
    console.error("Failed to update table status:", error);
    throw error;
  }
}
