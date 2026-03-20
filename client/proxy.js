import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const customerProtectedRoutes = [
    "/profile",
    "/cart",
    "/payment",
    "/review",
    "/confirm",
    "/success",
    "/user",
  ];
  const adminProtectedRoutes = ["/admin"];

  // Check for customer token
  const customerToken = request.cookies.get("customer_access_token")?.value;
  // Check for admin token
  const adminToken = request.cookies.get("user_access_token")?.value;

  // Protect customer routes
  if (customerProtectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!customerToken) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect admin routes (except login)
  if (pathname.startsWith("/admin")) {
    // If trying to access admin login, just let it through
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // For other admin routes, redirect to login if no token
    if (!adminToken) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
