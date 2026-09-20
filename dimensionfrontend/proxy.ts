import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import * as dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = new TextEncoder().encode(process.env.SECRET_KEY);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const TOKEN = request.cookies.get("TOKEN")?.value;
  console.log("The token found is => ", TOKEN);
  const isProtectedRoute =
    pathname.startsWith("/workspace") || pathname.startsWith("/projects");

  if (isProtectedRoute) {
    if (!TOKEN) {
      return NextResponse.redirect(new URL("/welcome", request.url));
    }

    try {
      await jwtVerify(TOKEN, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      console.error("JWT Verification failed:", error);
      const response = NextResponse.redirect(new URL("/welcome", request.url));
      response.cookies.delete("TOKEN");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/workspace/:path*", "/projects/:path*"],
};
