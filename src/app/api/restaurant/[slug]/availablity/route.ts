import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { findAvailableTables } from "@/utils/findAvailableTables";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const partySize = parseInt(
    req.nextUrl.searchParams.get("partySize") as string
  );
  const bookingTime = req.nextUrl.searchParams.get("time") as string;
  const bookingDate = req.nextUrl.searchParams.get("date") as string;

  if (isNaN(partySize) || !bookingTime || !bookingDate) {
    return NextResponse.json(
      {
        error: `One or more required fields are missing or invalid: partySize=${partySize}, time=${bookingTime}, date=${bookingDate}`,
      },
      { status: 400 }
    );
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      tables: { select: { id: true, seats: true, restaurant_id: true } },
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    return NextResponse.json(
      { error: `Restaurant not found` },
      { status: 404 }
    );
  }
  let availableTimes;
  try {
    availableTimes = await findAvailableTables({
      slug,
      bookingDate,
      bookingTime,
      restaurant: {
        opening_time: restaurant.open_time,
        closing_time: restaurant.close_time,
        tables: restaurant.tables,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { errorMessage: `Error finding available tables ${error}` },
      { status: 500 }
    );
  }

  if (!availableTimes) {
    return NextResponse.json(
      {
        error: `No matching times found for BookingTime=${bookingTime}`,
      },
      { status: 404 }
    );
  }

  const availabilities = availableTimes
    .map((t) => {
      const totalSeats =
        t.tables?.reduce((total, table) => total + table.seats, 0) ?? 0;
      return {
        time: t.time,
        available: totalSeats >= partySize,
      };
    })
    .filter((availability) => {
      const currentTime = new Date(`${bookingDate}T${availability.time}`);
      const openTime = new Date(`${bookingDate}T${restaurant.open_time}`);
      const closeTime = new Date(`${bookingDate}T${restaurant.close_time}`);
      return currentTime >= openTime && currentTime <= closeTime;
    });

  return NextResponse.json(availabilities, { status: 200 });
}
