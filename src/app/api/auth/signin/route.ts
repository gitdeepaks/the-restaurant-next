import { NextApiRequest } from "next";
import validator from "validator";
import { FormData } from "../../../../../formDataTypes";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import * as jose from "jose";

const prisma = new PrismaClient();

export async function GET() {
  return NextResponse.json({
    id: "deepaks",
  });
}

export async function POST(request: Request) {
  const res: FormData = await request.json();

  const errors: string[] = [];

  const validationSchema = [
    {
      valid: validator.isEmail(res.email),
      errorMessage: "Email is not valid",
    },
    {
      valid: validator.isLength(res.password, {
        min: 5,
      }),
      errorMessage: "Password is not valid",
    },
  ];

  validationSchema.forEach((validation) => {
    if (!validation.valid) {
      errors.push(validation.errorMessage);
    }
  });

  if (errors.length) {
    return NextResponse.json({ errorMessage: errors[0] });
  }

  const userWithEmail = await prisma.user.findUnique({
    where: {
      email: res.email,
    },
  });

  if (!userWithEmail) {
    return NextResponse.json({
      errorMessage: "Account not found",
    });
  }

  const isMatch = await bcrypt.compare(res.password, userWithEmail.password);

  if (!isMatch) {
    return NextResponse.json({
      errorMessage: "Invalid credentials",
    });
  }

  const alg = "HS256";
  const signature = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new jose.SignJWT({
    email: res.email,
  })
    .setProtectedHeader({ alg })
    .setExpirationTime("24h")
    .sign(signature);

  return NextResponse.json({ token });
}
