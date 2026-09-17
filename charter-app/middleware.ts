import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/register"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Allow public paths
  if (PUBLIC_PATHS.some(p => pathname === p || pathname === p + "/")) {
    return NextResponse.next();
  }

  // Allow static files
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  // Allow auth API routes (they do their own validation)
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  // Check session cookie for protected routes
  const sessionId = req.cookies.get("session")?.value;
  if (!sessionId) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // For dashboard and api routes, let them do DB-level session validation
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/extractions/:path*", "/api/auth/logout"],
};
