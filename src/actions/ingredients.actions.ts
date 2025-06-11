import { DEFAULT_HEADERS, managementBackendUrl } from "@/configs";
import {
  CreateIngredient,
  DetailedIngredient,
  DetailedIngredientListSchema,
  UpdateIngredient,
} from "@/types/ingredients.types";
import z from "zod";

const MANAGEMENT_BE_URL = managementBackendUrl();

export async function queryAllIngredientsOfBusiness(
  businessId: number
): Promise<DetailedIngredient[]> {
  try {
    const response = await fetch(
      `${MANAGEMENT_BE_URL}/ingredient/business/${businessId}`,
      {
        method: "GET",
        headers: DEFAULT_HEADERS,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseBody = await response.json();

    return DetailedIngredientListSchema.parse(responseBody);
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

export async function mutateCreateIngredient({
  businessId,
  createIngredient,
}: {
  businessId: number;
  createIngredient: CreateIngredient;
}): Promise<void> {
  try {
    const requestBody = {
      ...createIngredient,
      businessId,
    };

    const response = await fetch(`${MANAGEMENT_BE_URL}/ingredient`, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

export async function mutateUpdateIngredient({
  ingredientId,
  businessId,
  updateIngredient,
}: {
  ingredientId: number;
  businessId: number;
  updateIngredient: UpdateIngredient;
}): Promise<void> {
  try {
    const requestBody = {
      ...updateIngredient,
      businessId,
    };

    const response = await fetch(
      `${MANAGEMENT_BE_URL}/ingredient/${ingredientId}`,
      {
        method: "PATCH",
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

export async function mutateDeleteIngredient(
  ingredientId: number
): Promise<void> {
  try {
    const response = await fetch(
      `${MANAGEMENT_BE_URL}/ingredient/${ingredientId}`,
      {
        method: "DELETE",
        headers: DEFAULT_HEADERS,
      }
    );

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
