import RestaurantPrice from "@/app/components/Price";
import Stars from "@/app/restaurant/[slug]/components/Stars";
import { calculateReviewAverage } from "@/utils/calculateReviewAverage";
import { Location, PRICE, Region, Review } from "@prisma/client";
import { calculateOverrideValues } from "next/dist/server/font-utils";
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
  reviews: Review[];
}

function RestaurantCart({ restaurant }: { restaurant: RetaurantProps }) {
  const renderReviews = () => {
    const rating = calculateReviewAverage(restaurant.reviews);
    if (rating > 4) return "Awesome";
    else if (rating <= 4 && rating > 3) return "Good";
    else if (rating <= 3 && rating > 0) return "Average";
    else return "";
  };
  return (
    <div className="border-b flex pb-5">
      <img src={restaurant.main_image} alt="" className="w-44 rounded" />
      <div className="pl-5">
        <h2 className="text-3xl">{restaurant.name}</h2>
        <div className="flex items-start">
          <Stars reviews={restaurant.reviews} />
          <p className="ml-2 text-sm text-black">{renderReviews()}</p>
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
