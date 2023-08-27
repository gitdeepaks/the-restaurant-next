import { Review } from "@prisma/client";
import fullStar from "../../../../../public/icons/full-star.png";
import halfStar from "../../../../../public/icons/half-star.png";
import emptyStar from "../../../../../public/icons/empty-star.png";
import Image from "next/image";
import { calculateReviewAverage } from "@/utils/calculateReviewAverage";

function Stars({ reviews, rating }: { reviews: Review[]; rating?: number }) {
  const reviewRating = rating || calculateReviewAverage(reviews);

  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      const diff = parseFloat((reviewRating - i).toFixed(1));
      if (diff >= 1) {
        stars.push(fullStar);
      } else if (diff < 1 && diff > 0) {
        if (diff < 0.2) stars.push(emptyStar);
        else if (diff > 0.2 && diff <= 0.6) stars.push(halfStar);
      } else stars.push(emptyStar);
    }

    return stars.map((star) => (
      <Image src={star} alt="" className="w-4 h-4 mr-1" />
    ));
  };

  return <div className="flex">{renderStars()}</div>;
}
export default Stars;
