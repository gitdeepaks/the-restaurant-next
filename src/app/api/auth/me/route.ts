import { NextResponse } from "next/server";
import { headers } from "next/headers";
import * as jose from "jose";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const headerInstance = headers();
  const BearerToken = headerInstance.get("authorization");

  if (!BearerToken) {
    return NextResponse.json({
      errorMessage: "Invalid credentials",
    });
  }

  const token = BearerToken.split(" ")[1];

  if (!token) {
    return NextResponse.json({
      errorMessage: "Token not found",
    });
  }

  const signature = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    jose.jwtVerify(token, signature);
  } catch (error) {
    return NextResponse.json({
      errorMessage: "Invalid Rquest",
    });
  }

  const payLoad = jwt.decode(token) as { email: string };

  const user = await prisma.user.findUnique({
    where: {
      email: payLoad.email,
    },

    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      city: true,
      phone: true,
    },
  });

  return NextResponse.json({
    id: user,
  });
}
