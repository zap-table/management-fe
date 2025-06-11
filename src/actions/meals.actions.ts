import { DEFAULT_HEADERS, managementBackendUrl } from "@/configs";
import {
  CreateMeal,
  Meal,
  MealListSchema,
  UpdateMeal,
} from "@/types/meals.types";
import z from "zod";

const MANAGEMENT_BE_URL = managementBackendUrl();

export async function queryAllMeals(): Promise<Meal[]> {
  try {
    const response = await fetch(`${MANAGEMENT_BE_URL}/meal`, {
      method: "GET",
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseBody = await response.json();

    return MealListSchema.parse(responseBody);
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

export async function mutateCreateMeal({
  businessId,
  createMeal,
}: {
  businessId: number;
  createMeal: CreateMeal;
}): Promise<void> {
  try {
    const requestBody = {
      ...createMeal,
      businessId,
    };

    const response = await fetch(`${MANAGEMENT_BE_URL}/meal`, {
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

export async function mutateUpdateMeal({
  mealId,
  businessId,
  updateMeal,
}: {
  mealId: number;
  businessId: number;
  updateMeal: UpdateMeal;
}): Promise<void> {
  try {
    const requestBody = {
      ...updateMeal,
      businessId,
    };

    const response = await fetch(`${MANAGEMENT_BE_URL}/meal/${mealId}`, {
      method: "PATCH",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // TODO should parse response to updated model
    //const responseBody = await response.json();
    //return MealSchema.parse(responseBody);
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

export async function mutateDeleteMeal(mealId: number): Promise<void> {
  try {
    const response = await fetch(`${MANAGEMENT_BE_URL}/meal/${mealId}`, {
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
