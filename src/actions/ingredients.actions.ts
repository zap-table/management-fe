import { kyClient } from "@/lib/api-client";
import {
  CreateIngredient,
  DetailedIngredient,
  UpdateIngredient,
} from "@/types/ingredients.types";
import z from "zod";

export async function queryAllIngredientsOfBusiness(
  businessId: number
): Promise<DetailedIngredient[]> {
  try {
    return await kyClient
      .get<DetailedIngredient[]>(`ingredient/business/${businessId}`)
      .json();
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

    await kyClient.post(`ingredient`, {
      body: JSON.stringify(requestBody),
    });
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

    const response = await kyClient.patch(`ingredient/${ingredientId}`, {
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

export async function mutateDeleteIngredient(
  ingredientId: number
): Promise<void> {
  try {
    await kyClient.delete(`ingredient/${ingredientId}`);
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
