import { NextRequest, NextResponse } from "next/server";

// Capture ?fbclid=... into the Meta _fbc cookie on the very first response,
// so attribution survives any client-side URL stripping (PostHog, router, etc.).
export function middleware(request: NextRequest) {
  const fbclid = request.nextUrl.searchParams.get("fbclid");
  const response = NextResponse.next();

  if (fbclid && !request.cookies.get("_fbc")) {
    response.cookies.set({
      name: "_fbc",
      value: `fb.1.${Date.now()}.${fbclid}`,
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
      sameSite: "lax",
      secure: true,
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|team|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|css|js)).*)",
  ],
};
