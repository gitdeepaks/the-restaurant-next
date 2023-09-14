import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { times } from "@/data";
import { findAvailableTables } from "@/utils/findAvailableTables";

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

  // Validate query parameters
  if (!partySize || !bookingTime || !bookingDate) {
    return NextResponse.json(
      {
        error: `One or more required fields are missing: partySize=${partySize}, time=${bookingTime}, date=${bookingDate}`,
      },
      { status: 400 }
    );
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
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
    return NextResponse.json(
      {
        error: `Restaurant not found`,
      },
      { status: 404 }
    );
  }

  // Transform the restaurant data to match the expected type
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

  //
  const availablities = searchTimesWithTable
    .map((t) => {
      const totalSeats = t.tables?.reduce((total, table) => {
        return total + table.seats;
      }, 0);

      return {
        time: t.time,
        available: (totalSeats as number) >= parseInt(partySize),
      };
    })
    .filter((availablity) => {
      const timeAfterOpeningHour =
        new Date(`${bookingDate}T${availablity.time}`) >=
        new Date(`${bookingDate}T${restaurant?.open_time}`);
      const timeBeforeClosingHour =
        new Date(`${bookingDate}T${availablity.time}`) <=
        new Date(`${bookingDate}T${restaurant?.close_time}`);

      return timeAfterOpeningHour && timeBeforeClosingHour;
    });

  return NextResponse.json(
    availablities,
    // {
    //   searchedTimes,
    //   bookings,
    //   bookingTableObj,
    //   resTable,
    //   searchTimesWithTable,
    //   availablities,
    // },
    { status: 200 }
  );
}
