import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  if (pathname.startsWith("/business")) {
    const segments = pathname.split("/").filter(Boolean);
    
    // Ensure we have at least /business/[id] format
    if (segments.length >= 2 && segments[0] === "business") {
      const businessId = segments[1];
      
      // Validate business ID is a number
      if (businessId && !isNaN(Number(businessId))) {
        response.cookies.set("business", businessId);
        
        // Check for restaurant path: /business/[id]/restaurant/[id]
        if (segments.length >= 4 && segments[2] === "restaurant") {
          const restaurantId = segments[3];
          
          // Validate restaurant ID is a number
          if (restaurantId && !isNaN(Number(restaurantId))) {
            response.cookies.set("restaurant", restaurantId);
          }
        }
      }
    }
  } else {
    // Clear cookies for non-business paths
    response.cookies.delete("business");
    response.cookies.delete("restaurant");
  }

  return response;
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
