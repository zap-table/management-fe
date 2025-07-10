import { apiClient } from "@/lib/api-client";
import {
    CreateCategory,
    DetailedCategory,
    DetailedCategoryListSchema,
    UpdateCategory,
} from "@/types/categories.types";
import { z } from "zod";

const CategoryResponseSchema = z.object({
  message: z.string(),
});

export async function queryAllCategoryOfBusiness(
  businessId: number
): Promise<DetailedCategory[]> {
  try {
    const response = await apiClient.request(
      `/category/business/${businessId}`,
      {
        method: "GET",
      },
      DetailedCategoryListSchema
    );

    if (response.error || !response.data) {
      throw new Error(response.error || "Failed to fetch categories");
    }

    return response.data;
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

    const response = await apiClient.request(
      "/category",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
      },
      CategoryResponseSchema
    );

    if (response.error || !response.data) {
      throw new Error(response.error || "Failed to create category");
    }
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

    const response = await apiClient.request(
      `/category/${categoryId}`,
      {
        method: "PATCH",
        body: JSON.stringify(requestBody),
      },
      CategoryResponseSchema
    );

    if (response.error || !response.data) {
      throw new Error(response.error || "Failed to update category");
    }
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

export async function mutateDeleteCategory(categoryId: number): Promise<void> {
  try {
    const response = await apiClient.request(
      `/category/${categoryId}`,
      {
        method: "DELETE",
      },
      CategoryResponseSchema
    );

    if (response.error || !response.data) {
      throw new Error(response.error || "Failed to delete category");
    }
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
