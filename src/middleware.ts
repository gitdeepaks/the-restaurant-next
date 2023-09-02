import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export default async function middleware(request: NextRequest) {
  const BearerToken = request.headers.get("authorization") as string;

  if (!BearerToken) {
    return new NextResponse(
      JSON.stringify({ errorMessage: "Bearer Token is not Defined" })
    );
  }

  const token = BearerToken.split(" ")[1];

  if (!token) {
    return new NextResponse(
      JSON.stringify({ errorMessage: "Token not found" })
    );
  }

  const signature = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    await jose.jwtVerify(token, signature);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ errorMessage: "Invalid Request" })
    );
  }
}

export const config = {
  matcher: ["/api/auth/me"],
};
