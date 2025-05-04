import { NextRequest, NextResponse } from "next/server";

import { verifySession } from "./lib/actions/session";

const protectedRoutes = [/^\/create$/, /^\/notifications$/, /^\/settings$/];

const regex =
  /^\/api\/(cron-jobs|posts|auth|recents|discover|trending|users|comments|search|utils)/;

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isApiRoute = path.startsWith("/api");
  const { isAuth, username } = await verifySession();

  if (isApiRoute && !isAuth && !path.match(regex)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized!" },
      { status: 401 },
    );
  }

  const isProtected = protectedRoutes.some((regex) => regex.test(path));

  if (isProtected && !isAuth) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  if (isProtected && isAuth && !username) {
    return NextResponse.redirect(new URL("/create-username", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/!posts",
    "/api/((?!cron-jobs|posts|auth|recents|discover|trending|users|comments|search|utils).*)",
    "/((?!_next/static|_next/image|.*\\.png$).*)",
  ],
};
