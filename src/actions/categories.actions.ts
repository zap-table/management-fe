import { DEFAULT_HEADERS, managementBackendUrl } from "@/configs";
import {
  CreateCategory,
  DetailedCategory,
  DetailedCategoryListSchema,
  UpdateCategory,
} from "@/types/categories.types";
import z from "zod";

const MANAGEMENT_BE_URL = managementBackendUrl();

export async function queryAllCategoryOfBusiness(
  businessId: number
): Promise<DetailedCategory[]> {
  try {
    const response = await fetch(
      `${MANAGEMENT_BE_URL}/category/business/${businessId}`,
      {
        method: "GET",
        headers: DEFAULT_HEADERS,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseBody = await response.json();

    return DetailedCategoryListSchema.parse(responseBody);
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

    const response = await fetch(`${MANAGEMENT_BE_URL}/category`, {
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

    const response = await fetch(
      `${MANAGEMENT_BE_URL}/category/${categoryId}`,
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

export async function mutateDeleteCategory(categoryId: number): Promise<void> {
  try {
    const response = await fetch(
      `${MANAGEMENT_BE_URL}/category/${categoryId}`,
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
