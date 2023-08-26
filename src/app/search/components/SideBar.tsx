import { Location, PRICE, Region } from "@prisma/client";
import Link from "next/link";
import React from "react";

function SideBar({
  locations,
  regions,
  searhPrams,
}: {
  locations: Location[];
  regions: Region[];
  searhPrams: { city?: string; region?: string; price?: PRICE };
}) {
  const price = [
    {
      price: PRICE.CHEAP,
      label: "$",
      className:
        "border w-full text-center text-reg font-light rounded-l p-2 rounded-l",
    },

    {
      price: PRICE.REGULAR,
      label: "$$",
      className:
        "border-r border-t border-b w-full text-center text-reg font-light p-2",
    },
    {
      price: PRICE.EXPENSIVE,
      label: "$$$",
      className:
        "border-r border-t border-b w-full text-center text-reg font-light p-2 rounded-r",
    },
  ];
  return (
    <div className="w-1/5">
      <div className="border-b pb-4 mt-3 flex flex-col">
        <h1 className="mb-2">Location</h1>
        {locations.map((location: Location) => (
          <Link
            href={{
              pathname: "/search",
              query: { ...searhPrams, city: location.name },
            }}
            className="font-light text-reg capitalize"
          >
            {location.name}
          </Link>
        ))}
      </div>
      <div className="border-b pb-4 mt-3 flex flex-col">
        <h1 className="mb-2">Region</h1>
        {regions.map((region: Region) => (
          <Link
            href={{
              pathname: "/search",
              query: { ...searhPrams, region: region.name },
            }}
            className="font-light text-reg capitalize"
          >
            {region.name}
          </Link>
        ))}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          {price.map(({ price, label, className }) => (
            <Link
              href={{
                pathname: "/search",
                query: { ...searhPrams, price },
              }}
              className={className}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
