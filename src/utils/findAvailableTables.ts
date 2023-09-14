import { times } from "@/data";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAvailableTables = async ({
  bookingTime,
  bookingDate,
  restaurant,
}: {
  bookingTime: string;
  bookingDate: string;
  slug: string;
  restaurant: {
    opening_time: string;
    closing_time: string;
    tables: {
      id: number;
      seats: number;
      restaurant_id: number;
    }[];
  };
}) => {
  const searchedTimes = times.find((t) => {
    return t.time === bookingTime;
  })?.searchTimes;

  if (!searchedTimes) {
    return null;
  }

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
      if (
        bookingTableObj[t.date.toISOString()] &&
        bookingTableObj[t.date.toISOString()][table.id]
      ) {
        return false;
      }
      return true;
    });
  });

  return searchTimesWithTable;
};
