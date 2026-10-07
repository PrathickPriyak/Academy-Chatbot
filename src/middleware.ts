import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { adminCookieName, verifyAdminToken } from "@/lib/admin-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(adminCookieName)?.value;
  const signedIn = token ? await verifyAdminToken(token) : false;
  if (signedIn) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Admin sign-in is required." }, { status: 401 });
  }

  const login = request.nextUrl.clone();
  login.pathname = "/admin/login";
  login.search = "";
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
