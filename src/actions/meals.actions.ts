import { kyClient } from "@/lib/api-client";
import { CreateMeal, Meal, UpdateMeal } from "@/types/meals.types";
import z from "zod";

export async function queryMealsByBusiness(
  businessId: number
): Promise<Meal[]> {
  try {
    return await kyClient.get<Meal[]>(`meal/business/${businessId}`).json();
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

    await kyClient.post(`meal`, {
      body: JSON.stringify(requestBody),
    });
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
    await kyClient.patch(`meal/${mealId}`, {
      body: JSON.stringify(requestBody),
    });

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
    await kyClient.delete(`meal/${mealId}`, {
      method: "DELETE",
    });
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
