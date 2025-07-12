import { cookies } from "next/headers";

export async function isAuthenticated() {
  return (await cookies()).get("access_token")?.name ?? null;
}

export async function getCurrentBusiness() {
  return (await cookies()).get("business")?.value ?? null;
}

export async function getCurrentRestaurant() {
  return (await cookies()).get("restaurant")?.value ?? null;
}
