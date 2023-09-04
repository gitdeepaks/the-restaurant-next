import { NextResponse } from "next/server";
import validator from "validator";
import { FormData } from "../../../../../formDataTypes";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as jose from "jose";

export function GET() {
  return NextResponse.json({
    id: "signup",
  });
}

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const res: FormData = await request.json();
  const errors: string[] = [];

  const validationSchema = [
    {
      valid: validator.isLength(res.firstName, { min: 1, max: 20 }),
      errorMessages: "First name must be between 1 and 20 characters",
    },
    {
      valid: validator.isLength(res.lastName, { min: 1, max: 20 }),
      errorMessages: "Last name must be between 1 and 20 characters",
    },
    {
      valid: validator.isLength(res.city, { min: 1, max: 20 }),
      errorMessages: "City must be between 1 and 20 characters",
    },
    {
      valid: validator.isEmail(res.email),
      errorMessages: "Email is not valid",
    },
    {
      valid: validator.isMobilePhone(String(res.phoneNumber)),
      errorMessages: "Phone Number is not valid",
    },
    {
      valid: validator.isLength(res.password, { min: 5 }),
      errorMessages: "Password should be at least 5 characters long.",
    },
  ];

  validationSchema.forEach((check) => {
    if (!check.valid) {
      errors.push(check.errorMessages);
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

  if (userWithEmail) {
    return new NextResponse(
      JSON.stringify({ errorMessage: "Email already exists" }),
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(res.password, 10);

  const user = await prisma.user.create({
    data: {
      first_name: res.firstName,
      last_name: res.lastName,
      email: res.email,
      city: res.city,
      phone: String(res.phoneNumber),
      password: hashedPassword,
    },
  });

  const alg = "HS256";
  const signature = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new jose.SignJWT({
    email: res.email,
  })
    .setProtectedHeader({ alg })
    .setExpirationTime("24h")
    .sign(signature);

  const resp = NextResponse.json(
    {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      city: user.city,
      phoneNumber: user.phone,
      email: user.email,
      hashedPassword: user.password,
    },
    { status: 200 }
  );

  resp.cookies.set({
    name: "token",
    value: token,
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return resp;
}
