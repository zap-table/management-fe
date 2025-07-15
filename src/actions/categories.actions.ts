import { createAuthenticatedClient } from "@/lib/api-client";
import {
  CreateCategory,
  DetailedCategory,
  UpdateCategory,
} from "@/types/categories.types";
import { z } from "zod";

export async function queryAllCategoryOfBusiness(
  businessId: number
): Promise<DetailedCategory[]> {
  try {
    const kyClient = await createAuthenticatedClient();
    return await kyClient
      .get<DetailedCategory[]>(`category/business/${businessId}`)
      .json();
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

export async function mutateCreateCategory({
  businessId,
  createCategory,
}: {
  businessId: number;
  createCategory: CreateCategory;
}): Promise<void> {
  try {
    const requestBody = {
      ...createCategory,
      businessId,
    };
    const kyClient = await createAuthenticatedClient();
    await kyClient.post("category", {
      body: JSON.stringify(requestBody),
    });
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

export async function mutateUpdateCategory({
  categoryId,
  businessId,
  updateCategory,
}: {
  categoryId: number;
  businessId: number;
  updateCategory: UpdateCategory;
}): Promise<void> {
  try {
    const requestBody = {
      ...updateCategory,
      businessId,
    };

    const kyClient = await createAuthenticatedClient();

    await kyClient.patch(`category/${categoryId}`, {
      body: JSON.stringify(requestBody),
    });
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

export async function mutateDeleteCategory(categoryId: number): Promise<void> {
  try {
    const kyClient = await createAuthenticatedClient();
    await kyClient.delete(`category/${categoryId}`);
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

function checkError(error: unknown) {
  if (error instanceof z.ZodError) {
    console.error("Validation error:", error.errors);
  } else if (error instanceof Error) {
    console.error("API error:", error.message);
  } else {
    console.error("Unknown error:", error);
  }
}
