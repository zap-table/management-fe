import { createAuthenticatedClient } from "@/lib/api-client";
import {
  BaseRestaurantMenu,
  CreateRestaurantMenu,
  MenuItem,
  UpdateRestaurantMenu,
} from "@/types/menus-types";
import z from "zod";

export async function fetchAllMenus(): Promise<MenuItem[]> {
  try {
    const kyClient = await createAuthenticatedClient();
    return await kyClient.get<MenuItem[]>(`menu`).json();
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

export async function mutateCreateRestaurantMenu({
  businessId,
  createdRestaurantMenu,
}: {
  businessId: number;
  createdRestaurantMenu: CreateRestaurantMenu;
}): Promise<BaseRestaurantMenu> {
  try {
    const requestBody = {
      ...createdRestaurantMenu,
      businessId,
    };

    const kyClient = await createAuthenticatedClient();
    return await kyClient
      .post<BaseRestaurantMenu>(`menu`, {
        body: JSON.stringify(requestBody),
      })
      .json();
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

export async function mutateUpdateRestaurantMenu({
  businessId,
  updatedRestaurant,
}: {
  businessId: number;
  updatedRestaurant: UpdateRestaurantMenu;
}): Promise<void> {
  try {
    const requestBody = {
      ...updatedRestaurant,
      businessId,
    };

    const kyClient = await createAuthenticatedClient();

    await kyClient.patch(`menu/${updatedRestaurant.id}`, {
      body: JSON.stringify(requestBody),
    });

    // TODO should parse response to updated model
    //const responseBody = await response.json();
    //return MenuItemSchema.parse(responseBody);
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

export async function mutateDeleteMenu(menuId: number): Promise<void> {
  try {
    const kyClient = await createAuthenticatedClient();
    const response = await kyClient.delete(`menu/${menuId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error: unknown) {
    throw error;
  }
}

function checkError(error: unknown) {
  if (error instanceof z.ZodError) {
    console.error("Validation error:", error.errors);
  } else if (error instanceof Error) {
    console.error("Fetch error:", error.message);
  } else {
    console.error("Unknown error:", error);
  }
}
