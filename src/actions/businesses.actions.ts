import { apiClient } from "@/lib/api-client";
import { Business, BusinessArraySchema } from "@/types/businesses.types";
import z from "zod";

export async function queryUserBusinesses(): Promise<Business[]> {
  try {
    const response = await apiClient.request(
      "/business/user",
      {
        method: "GET",
      },
      BusinessArraySchema
    );

    if (response.error || !response.data) {
      throw new Error(response.error || "Fetching Businesses failed");
    }

    return response.data;
  } catch (error: unknown) {
    checkError(error);
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
