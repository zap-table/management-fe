import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AUTH_PAGES } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateQRCode(url: string): Promise<string> {
  // Em um ambiente real, você pode usar uma API para gerar QR codes
  // Por enquanto, vamos apenas retornar a URL que seria codificada
  return url;
}

export function isOnAuthPage(pathName?: string): boolean {
  if (typeof window === "undefined") return false;
  
  const currentPath = pathName || window.location.pathname;
  return AUTH_PAGES.some((page) => currentPath.startsWith(page));
}

// Utility function to validate numeric IDs
export function isValidNumericId(id: string | number): boolean {
  if (typeof id === "number") return id > 0;
  if (typeof id === "string") {
    const numId = Number(id);
    return !isNaN(numId) && numId > 0;
  }
  return false;
}

// Utility function to safely parse business/restaurant IDs from path
export function parseIdsFromPath(path: string): { businessId: string | null; restaurantId: string | null } {
  const segments = path.split("/").filter(Boolean);
  
  if (segments.length < 2 || segments[0] !== "business") {
    return { businessId: null, restaurantId: null };
  }

  const businessId = segments[1];
  if (!isValidNumericId(businessId)) {
    return { businessId: null, restaurantId: null };
  }

  if (segments.length === 2) {
    return { businessId, restaurantId: null };
  }

  if (segments.length === 4 && segments[2] === "restaurant") {
    const restaurantId = segments[3];
    if (!isValidNumericId(restaurantId)) {
      return { businessId, restaurantId: null };
    }
    return { businessId, restaurantId };
  }

  return { businessId, restaurantId: null };
}
