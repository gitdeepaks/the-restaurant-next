import { Review } from "@prisma/client";

export function calculateReviewAverage(reviews: Review[]) {
  //   sum of all reviews /total review

  if (reviews.length === 0) {
    return 0;
  }

  return (
    reviews.reduce((acc, review) => {
      return acc + review.rating;
    }, 0) / reviews.length
  );
}
