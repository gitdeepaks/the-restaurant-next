import { NextResponse } from "next/server";
import { headers } from "next/headers";
import * as jose from "jose";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const headerInstance = headers();
  const BearerToken = headerInstance.get("authorization") as string;

  const token = BearerToken.split(" ")[1];

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
