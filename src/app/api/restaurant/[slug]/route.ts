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
  const partySize = req.nextUrl.searchParams.get("partySize");
  const bookingTime = req.nextUrl.searchParams.get("bookingTime");
  const bookingDate = req.nextUrl.searchParams.get("bookingDate");

  // Validate query parameters
  if (!partySize || !bookingTime || !bookingDate) {
    return NextResponse.json(
      {
        error: `One or more required fields are missing: PartySize=${partySize}, BookingTime=${bookingTime}, BookingDate=${bookingDate}`,
      },
      { status: 400 }
    );
  }

  // Find the matching time
  const searchedTimes = times.find((t) => {
    return t.time === bookingTime;
  });

  if (!searchedTimes) {
    return NextResponse.json(
      {
        error: `No matching times found for BookingTime=${bookingTime}`,
      },
      { status: 404 }
    );
  }

  // ... your existing code ...

  const rawBookingDate = req.nextUrl.searchParams.get("bookingDate");
  if (!rawBookingDate) {
    return NextResponse.json(
      {
        error: `Booking date is missing or invalid.`,
      },
      { status: 400 }
    );
  }

  const bookingDateFormatted = `${rawBookingDate.slice(
    4,
    8
  )}-${rawBookingDate.slice(0, 2)}-${rawBookingDate.slice(2, 4)}`;

  const rawBookingTime = req.nextUrl.searchParams.get("bookingTime");
  if (!rawBookingTime) {
    return NextResponse.json(
      {
        error: `Booking time is missing or invalid.`,
      },
      { status: 400 }
    );
  }
  const bookingTimeFormatted = rawBookingTime.split("T")[1].slice(0, 5);

  // Now use bookingDateFormatted and bookingTimeFormatted in your database query:
  const gteDate = new Date(`${bookingDateFormatted}T${bookingTimeFormatted}`);
  const lteDate = new Date(`${bookingDateFormatted}T${bookingTimeFormatted}`); // Adjust this if necessary

  // try {
  // Fetch bookings from the database
  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: gteDate,
        lte: lteDate,
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

  const searchTimesWithTable = searchedTimes.searchTimes.map((time) => {
    return {
      date: new Date(`${bookingDateFormatted}T${time}`),
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
