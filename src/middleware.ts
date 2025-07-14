import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  setBusinessAndRestaurantCookiesInResponse(response, pathname);

  return response;
}

function setBusinessAndRestaurantCookiesInResponse(
  response: NextResponse,
  pathname: string
) {
  if (pathname.startsWith("/business")) {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length >= 2 && segments[0] === "business") {
      const businessId = segments[1];

      if (businessId && !isNaN(Number(businessId))) {
        response.cookies.set("business", businessId, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // Check for restaurant path: /business/[id]/restaurant/[id]
        if (segments.length >= 4 && segments[2] === "restaurant") {
          const restaurantId = segments[3];

          if (restaurantId && !isNaN(Number(restaurantId))) {
            response.cookies.set("restaurant", restaurantId, {
              httpOnly: false,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 7, // 7 days
            });
          }
        }
      }
    }
  } else if (pathname === "/" || pathname.startsWith("/auth")) {
    // Only clear cookies for specific non-business paths
    response.cookies.delete("business");
    response.cookies.delete("restaurant");
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
