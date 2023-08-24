import { Item } from "@prisma/client";
import React from "react";
import RestaurantMenuCard from "./RestaurantMenuCard";

function RestaurantMenu({ items }: { items: Item[] }) {
  return (
    <main className="bg-white mt-5">
      <div>
        <div className="mt-4 pb-1 mb-1">
          <h1 className="font-bold text-4xl">Menu</h1>
        </div>
        <div className="flex flex-wrap justify-between">
          {items.length ? (
            <div className="flex flex-wrap justify-between">
              {items.map((item) => (
                <RestaurantMenuCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-between">
              <p>This restaurant does not ave menu</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default RestaurantMenu;
