import NavBar from "@/app/components/NavBar";
import Header from "./components/Header";
import Form from "./components/Form";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export interface searchParams {
  partySize: string;
  date: string;
  time: string;
}

export interface RestaurantData {
  id: number;
  name: string;
  main_image: string;
}

const fetchRestaurant = async (slug: string): Promise<RestaurantData> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      images: true,
      main_image: true,
    },
  });

  if (!restaurant) {
    notFound();
  }

  return restaurant;
};

export default async function RestaurantMenuPage({
  params,
  searchParams,
}: {
  searchParams: searchParams;
  params: { slug: string };
}) {
  const restaurantt = await fetchRestaurant(params.slug);
  return (
    <>
      <div className="border-t h-screen">
        <div className="py-9 w-3/5 m-auto">
          <Header searchParams={searchParams} restaurant={restaurantt} />
          <Form />
        </div>
      </div>
    </>
  );
}
