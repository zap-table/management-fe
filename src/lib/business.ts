import { getCookie } from "cookies-next/client";

interface ParsedIds {
  businessId: string | null;
  restaurantId: string | null;
}

export function parseBusinessRestaurantIds(path: string): ParsedIds {
  if (path === "/" || path === "") {
    return { businessId: null, restaurantId: null };
  }

  const segments = path.replace(/^\//, "").split("/").filter(Boolean);

  if (segments[0] !== "business" || segments.length < 2) {
    return { businessId: null, restaurantId: null };
  }

  const businessId = segments[1];
  if (!businessId || isNaN(Number(businessId))) {
    return { businessId: null, restaurantId: null };
  }

  if (segments.length === 2) {
    return { businessId, restaurantId: null };
  }

  if (segments.length >= 4 && segments[2] === "restaurant") {
    const restaurantId = segments[3];

    // Validate restaurant ID is a number
    if (!restaurantId || isNaN(Number(restaurantId))) {
      return { businessId, restaurantId: null };
    }

    return { businessId, restaurantId };
  }

  // For any other format, return business ID only
  return { businessId, restaurantId: null };
}

// Client side
export function getBusinessRestaurantIdsClient(path: string): ParsedIds {
  const urlParsed = parseBusinessRestaurantIds(path);

  if (urlParsed.businessId && urlParsed.restaurantId) {
    return urlParsed;
  }

  if (urlParsed.businessId && !urlParsed.restaurantId) {
    const restaurantCookie = getCookie("restaurant");

    return {
      businessId: urlParsed.businessId,
      restaurantId: restaurantCookie || null,
    };
  }

  if (!urlParsed.businessId) {
    const businessCookie = getCookie("business");

    const restaurantCookie = getCookie("restaurant");

    return {
      businessId: businessCookie || null,
      restaurantId: restaurantCookie || null,
    };
  }

  return urlParsed;
}
