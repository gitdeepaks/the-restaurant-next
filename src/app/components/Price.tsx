import { PRICE } from "@prisma/client";
import React from "react";

function RestaurantPrice({ price }: { price: PRICE }): JSX.Element {
  const renderPrice = () => {
    if (price === PRICE.CHEAP) {
      return (
        <>
          <span>$$</span>
          <span className="text-gray-400">$$</span>
        </>
      );
    } else if (price === PRICE.REGULAR) {
      return (
        <>
          <span>$$$</span>
          <span className="text-gray-400">$</span>
        </>
      );
    } else if (price === PRICE.EXPENSIVE) {
      return (
        <>
          <span>$$$$</span>
        </>
      );
    } else {
      return null; // Handle other cases, if there's a possibility of price being something other than the three values above.
    }
  };

  return <p className="flex mr-3">{renderPrice()}</p>;
}

export default RestaurantPrice;
