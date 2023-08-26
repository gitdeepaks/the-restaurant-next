import RestaurantPrice from "@/app/components/Price";
import { Location, PRICE, Region } from "@prisma/client";
import Link from "next/link";
import React from "react";

interface RetaurantProps {
  id: number;
  name: string;
  main_image: string;
  slug: string;
  price: PRICE;
  location: Location;
  region: Region;
}

function RestaurantCart({ restaurant }: { restaurant: RetaurantProps }) {
  return (
    <div className="border-b flex pb-5">
      <img src={restaurant.main_image} alt="" className="w-44 rounded" />
      <div className="pl-5">
        <h2 className="text-3xl">{restaurant.name}</h2>
        <div className="flex items-start">
          <div className="flex mb-2 text-black">*****</div>
          <p className="ml-2 text-sm text-black">Awesome</p>
        </div>
        <div className="mb-9">
          <div className="font-light flex text-reg">
            <RestaurantPrice price={restaurant.price} />
            <p className="mr-4">{restaurant.region.name}</p>
            <p className="mr-4">{restaurant.location.name}</p>
          </div>
        </div>
        <div className="text-red-600">
          <Link href={`/restaurant/${restaurant.slug}`}>
            View more information
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCart;
