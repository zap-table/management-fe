import { kyClient } from "@/lib/api-client";
import { Business } from "@/types/businesses.types";
import z from "zod";

export async function queryUserBusinesses(): Promise<Business[]> {
  try {
    return await kyClient.get<Business[]>("business/user").json();
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
