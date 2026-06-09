import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(
  request: NextRequest
) {
  const adminCookie =
    request.cookies.get(
      "admin-auth"
    )?.value;

  const pathname =
  request.nextUrl.pathname;

  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  const isLoginPage =
    request.nextUrl.pathname ===
    "/admin-login";

  if (
    isAdminRoute &&
    adminCookie !== "true"
  ) {
    return NextResponse.redirect(
      new URL(
        "/admin-login",
        request.url
      )
    );
  }

  if (
    isLoginPage &&
    adminCookie === "true"
  ) {
    return NextResponse.redirect(
      new URL(
        "/admin",
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin-login",
  ],
};