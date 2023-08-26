import { Location, Region } from "@prisma/client";
import React from "react";

function SideBar({
  locations,
  regions,
}: {
  locations: Location[];
  regions: Region[];
}) {
  return (
    <div className="w-1/5">
      <div className="border-b pb-4">
        <h1 className="mb-2">Location</h1>
        {locations.map((location: Location) => (
          <p className="font-light text-reg capitalize">{location.name}</p>
        ))}
      </div>
      <div className="border-b pb-4 mt-3">
        {regions.map((region: Region) => (
          <p className="font-light text-reg capitalize">{region.name}</p>
        ))}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          <button className="border w-full text-reg font-light rounded-l p-2">
            $
          </button>
          <button className="border-r border-t border-b w-full text-reg font-light p-2">
            $$
          </button>
          <button className="border-r border-t border-b w-full text-reg font-light p-2 rounded-r">
            $$$
          </button>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
