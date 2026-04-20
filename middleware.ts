import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  // Redirect www to non-www
  if (hostname.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = hostname.replace("www.", "");
    return NextResponse.redirect(url, 301);
  }

  const isAdminDomain =
    hostname.startsWith("office.atlas.com") ||
    hostname.startsWith("office.");

  // Rewrite office.atlas.com/* to /admin/*
  if (isAdminDomain) {
    const pathname = request.nextUrl.pathname;

    // Don't rewrite auth, API routes, or static assets
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/auth") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next") ||
      pathname === "/favicon.ico" ||
      pathname === "/icon.svg"
    ) {
      // For admin pages, check auth
      if (pathname.startsWith("/admin")) {
        const sessionCookie = request.cookies.get(
          "better-auth.session_token") || request.cookies.get("__Secure-better-auth.session_token"
        );
        if (!sessionCookie?.value) {
          return NextResponse.redirect(new URL("/auth", request.url));
        }
      }
      return NextResponse.next();
    }

    // Rewrite root to /admin, redirect anything else to /admin
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.rewrite(url);
    }
    // Any other path on office domain that's not admin/auth/api → redirect to /admin
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
