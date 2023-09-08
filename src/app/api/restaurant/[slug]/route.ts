import { NextRequest, NextResponse } from "next/server";
import { times } from "@/data";

//http://localhost:3000/api/restaurant/ramakrishna-indian-restaurant-ottawa?partySize=2&bookingTime=18%3A00&bookingDate=2021-10-20

export function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const partySize = req.nextUrl.searchParams.get("partySize") as string;
  const bookingTime = req.nextUrl.searchParams.get("bookingTime") as string;
  const bookingDate = req.nextUrl.searchParams.get("bookingDate") as string;

  if (!partySize || !bookingTime || !bookingDate) {
    return NextResponse.json(
      {
        error: `One of the required Fields are missing PartyTime=${partySize}, BookingTime=${bookingTime} and BookingDate=${bookingDate}`,
      },
      { status: 400 }
    );
  }

  const searchedTimes = times.find((time) => {
    return time.time === bookingTime;
  });

  return NextResponse.json(
    { searchTimes: searchedTimes?.searchTimes },
    { status: 200 }
  );
}
