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

export async function POST(request: Response) {
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
    return new NextResponse(JSON.stringify({ errorMessage: errors[0] }), {
      status: 400,
    });
  }

  const userWithEmail = await prisma.user.findUnique({
    where: {
      email: res.email,
    },
  });

  if (!userWithEmail) {
    return new NextResponse(
      JSON.stringify({ errorMessage: "Invalid credentials" }),
      { status: 400 }
    );
  }

  const isMatch = await bcrypt.compare(res.password, userWithEmail.password);

  if (!isMatch) {
    return new NextResponse(
      JSON.stringify({ errorMessage: "Invalid credentials for Password" }),
      { status: 400 }
    );
  }

  const alg = "HS256";
  const signature = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new jose.SignJWT({
    email: res.email,
  })
    .setProtectedHeader({ alg })
    .setExpirationTime("24h")
    .sign(signature);

  const response = NextResponse.json(
    {
      id: userWithEmail.id,
      firstName: userWithEmail.first_name,
      lastName: userWithEmail.last_name,
      city: userWithEmail.city,
      phoneNumber: userWithEmail.phone,
      email: userWithEmail.email,
    },
    { status: 200 }
  );
  response.cookies.set({
    name: "jwt",
    value: token,
    maxAge: 60 * 60 * 24,
  });
  return response;
}
