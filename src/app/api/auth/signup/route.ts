import { NextResponse } from "next/server";
import validator from "validator";
import { FormData } from "../../../../../formDataTypes";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

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
    return NextResponse.json({ errorMessages: errors[0] });
  }

  const userWithEmail = await prisma.user.findUnique({
    where: {
      email: res.email,
    },
  });

  if (userWithEmail) {
    return NextResponse.json({
      errorMessages: "email address alredy is there with another account",
    });
  }

  const hashedPassword = await bcrypt.hash(res.password, 10);

  return NextResponse.json({ res, hashedPassword });
}
