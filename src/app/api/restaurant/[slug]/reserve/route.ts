import { findAvailableTables } from "@/utils/findAvailableTables";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface bookingData {
  bookerEmail: string;
  bookerPhone: string;
  bookerFirstName: string;
  bookerLastName: string;
  bookerOccasion: string;
  bookerRequest: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // Extract query parameters
  const partySize = req.nextUrl.searchParams.get("partySize") as string;
  const bookingTime = req.nextUrl.searchParams.get("time") as string;
  const bookingDate = req.nextUrl.searchParams.get("date") as string;

  const {
    bookerEmail,
    bookerFirstName,
    bookerLastName,
    bookerOccasion,
    bookerRequest,
    bookerPhone,
  }: bookingData = await req.json();

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
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
        errorMessage: `Restaurant with slug ${slug} not found`,
      },
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
    return NextResponse.json(
      {
        errorMessage: `Restaurant is not open at ${bookingTime} on ${bookingDate}`,
      },
      {
        status: 404,
      }
    );
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

  const availableTablesWithSeats: {
    2: number[];
    4: number[];
  } = {
    2: [],
    4: [],
  };

  availableTables.tables.forEach((table) => {
    if (table.seats === 2) {
      availableTablesWithSeats[2].push(table.id);
    } else {
      availableTablesWithSeats[4].push(table.id);
    }
  });

  const totalSeatsAvailable =
    availableTablesWithSeats[2].length * 2 +
    availableTablesWithSeats[4].length * 4;
  if (totalSeatsAvailable < parseInt(partySize)) {
    return NextResponse.json(
      {
        error: `Not enough seats available for partySize=${partySize}`,
      },
      { status: 404 }
    );
  }

  const tablesToBook: number[] = [];

  let seatRemaining = parseInt(partySize);

  while (seatRemaining > 0) {
    if (seatRemaining >= 3) {
      if (availableTablesWithSeats[4].length) {
        tablesToBook.push(availableTablesWithSeats[4][0]);
        availableTablesWithSeats[4].shift();
        seatRemaining -= 4;
      } else {
        tablesToBook.push(availableTablesWithSeats[2][0]);
        availableTablesWithSeats[2].shift();
        seatRemaining -= 2;
      }
    } else {
      if (availableTablesWithSeats[2].length) {
        tablesToBook.push(availableTablesWithSeats[2][0]);
        availableTablesWithSeats[2].shift();
        seatRemaining -= 2;
      }
    }
  }

  const booking = await prisma.booking.create({
    data: {
      number_of_people: parseInt(partySize),
      booker_email: bookerEmail,
      booker_first_name: bookerFirstName,
      booker_last_name: bookerLastName,
      booker_occasion: bookerOccasion,
      booker_request: bookerRequest,
      booker_phone: bookerPhone,
      booking_time: new Date(`${bookingDate}T${bookingTime}`),
      restaurant_id: restaurant.id,
    },
  });

  const bookingOnTableData = tablesToBook.map((tableId) => {
    return {
      booking_id: booking.id,
      table_id: tableId,
    };
  });

  await prisma.bookingOnTable.createMany({
    data: bookingOnTableData,
  });

  return NextResponse.json(booking);
}

/*
"bookerEmail": "test@yahoo.com",
  "bookerPhone": "1234567890",
  "bookerFirstName": "test123",
  "bookerLastName": "test123ln",
  "bookerOccasion": "birthday",
  "bookerRequest": "test request cake",

  */
