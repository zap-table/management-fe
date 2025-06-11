import { managementBackendUrl } from "@/configs";
import {
  BaseRestaurantMenu,
  BaseRestaurantMenuSchema,
  CreateRestaurantMenu,
  MenuArraySchema,
  MenuItem,
  UpdateRestaurantMenu,
} from "@/types/menus-types";
import z from "zod";

const MANAGEMENT_BE_URL = managementBackendUrl();
const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export async function fetchAllMenus(): Promise<MenuItem[]> {
  try {
    const response = await fetch(`${MANAGEMENT_BE_URL}/menu`, {
      method: "GET",
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseBody = await response.json();

    return MenuArraySchema.parse(responseBody);
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

    const response = await fetch(`${MANAGEMENT_BE_URL}/menu`, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseBody = await response.json();

    return BaseRestaurantMenuSchema.parse(responseBody);
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

    const response = await fetch(
      `${MANAGEMENT_BE_URL}/menu/${updatedRestaurant.id}`,
      {
        method: "PATCH",
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

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
    const response = await fetch(`${MANAGEMENT_BE_URL}/menu/${menuId}`, {
      method: "DELETE",
      headers: DEFAULT_HEADERS,
    });

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
