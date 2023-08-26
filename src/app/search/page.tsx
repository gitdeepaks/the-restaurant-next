import { Metadata } from "next";
import NavBar from "../components/NavBar";
import Header from "./components/Header";
import RestaurantCart from "./components/RestaurantCart";
import SideBar from "./components/SideBar";
import { PRICE, PrismaClient } from "@prisma/client";

export const metadata: Metadata = {
  title: "Search",
  description: "Generated by create next app",
  keywords: ["deepak", "page"],
};

const prisma = new PrismaClient();

const fetchRestaurants = (city: string | undefined) => {
  const select = {
    id: true,
    name: true,
    main_image: true,
    price: true,
    location: true,
    slug: true,
    region: true,
  };
  if (!city) {
    return prisma.restaurant.findMany({ select });
  }
  return prisma.restaurant.findMany({
    where: {
      location: {
        name: {
          equals: city.toLocaleLowerCase(),
        },
      },
    },
    select,
  });
};

const fetchLoactions = () => {
  return prisma.location.findMany();
};

const fetchRegions = () => {
  return prisma.region.findMany();
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { city?: string; region?: string; price?: PRICE };
}) {
  const restaurants = await fetchRestaurants(searchParams.city);

  const locations = await fetchLoactions();

  const regions = await fetchRegions();

  console.log(restaurants);
  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SideBar
          locations={locations}
          regions={regions}
          searhPrams={searchParams}
        />
        <div className="w-5/6">
          {restaurants.length ? (
            restaurants.map((restaurant) => (
              <RestaurantCart restaurant={restaurant} />
            ))
          ) : (
            <p>sorry no retaurant was found</p>
          )}
        </div>
      </div>
    </>
  );
}
