import { findAvailableTables } from "@/utils/findAvailableTables";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // Extract query parameters
  const partySize = req.nextUrl.searchParams.get("partySize") as string;
  const bookingTime = req.nextUrl.searchParams.get("time") as string;
  const bookingDate = req.nextUrl.searchParams.get("date") as string;

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      tables: {
        select: {
          id: true,
          seats: true,
          restaurant_id: true,
        },
      },
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    return (
      NextResponse.json({
        errorMessage: `Restaurant with slug ${slug} not found`,
      }),
      {
        status: 404,
      }
    );
  }

  if (
    new Date(`${bookingDate}T${bookingTime}`) <
      new Date(`${bookingDate}T${restaurant.open_time}`) ||
    new Date(`${bookingDate}T${bookingTime}`) >
      new Date(`${bookingDate}T${restaurant.close_time}`)
  ) {
    NextResponse.json({
      errorMessage: `Restaurant is not open at ${bookingTime} on ${bookingDate}`,
    }),
      {
        status: 404,
      };
  }

  const transformedRestaurant = {
    ...restaurant,
    opening_time: restaurant.open_time,
    closing_time: restaurant.close_time,
  };

  const searchTimesWithTable = await findAvailableTables({
    slug,
    bookingDate,
    bookingTime,
    restaurant: transformedRestaurant,
  });

  if (!searchTimesWithTable) {
    return NextResponse.json(
      {
        error: `No matching times found for BookingTime=${bookingTime}`,
      },
      { status: 404 }
    );
  }

  const availableTables = searchTimesWithTable?.find((t) => {
    return (
      t.date.toISOString() ===
      new Date(`${bookingDate}T${bookingTime}`).toISOString()
    );
  });

  if (!availableTables) {
    return NextResponse.json(
      {
        error: `No table available for BookingTime=${bookingTime}`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    slug,
    partySize,
    bookingTime,
    bookingDate,
    searchTimesWithTable,
    availableTables,
  });
}
