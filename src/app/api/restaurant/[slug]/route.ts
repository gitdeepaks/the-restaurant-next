import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { times } from "@/data";

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

  // Find the matching time
  const searchedTimes = times.find((t) => {
    return t.time === bookingTime;
  })?.searchTimes;

  if (!searchedTimes) {
    return NextResponse.json(
      {
        error: `No matching times found for BookingTime=${bookingTime}`,
      },
      { status: 404 }
    );
  }

  // ... your existing code ...

  // Now use bookingDateFormatted and bookingTimeFormatted in your database query:

  // try {
  // Fetch bookings from the database
  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${bookingDate}T${searchedTimes[0]}`),
        lte: new Date(
          `${bookingDate}T${searchedTimes[searchedTimes.length - 1]}`
        ),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  const bookingTableObj: { [key: string]: { [key: number]: true } } = {};

  bookings.forEach((booking) => {
    bookingTableObj[booking.booking_time.toISOString()] = booking.tables.reduce(
      (obj, table) => {
        return {
          ...obj,
          [table.table_id]: true,
        };
      },
      {}
    );
  });

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
    },
  });

  const resTable = restaurant?.tables;

  const searchTimesWithTable = searchedTimes.map((time) => {
    return {
      date: new Date(`${bookingDate}T${time}`),
      time,
      tables: resTable,
    };
  });

  searchTimesWithTable.forEach((t) => {
    t.tables = t.tables?.filter((table) => {
      if (!bookingTableObj[t.date.toISOString()]) {
        if (bookingTableObj[t.date.toISOString()][table.id]) {
          return false;
        } else {
          return true;
        }
      }
    });
  });

  return NextResponse.json(
    {
      searchedTimes,
      bookings,
      bookingTableObj,
      resTable,
      searchTimesWithTable,
    },
    { status: 200 }
  );
}
