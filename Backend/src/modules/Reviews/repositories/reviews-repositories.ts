import prisma from "@/helpers/db/prisma/client";
import { RatingType } from "@/generated/prisma";

export default class ReviewsRepository {
  static async submitRating(
    userId: number,
    rating: number,
    type: RatingType,
    targetId: number,
    review?: string,
    productId?: number,
  ) {
    return prisma.rating.create({
      data: {
        userId,
        rating,
        review,
        type,
        targetId,
        productId,
      },
    });
  }

  static async getAverageRating(
    targetId: number,
    type: RatingType,
  ): Promise<number> {
    const aggregate = await prisma.rating.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        targetId,
        type,
      },
    });

    return aggregate._avg.rating || 0;
  }
}
