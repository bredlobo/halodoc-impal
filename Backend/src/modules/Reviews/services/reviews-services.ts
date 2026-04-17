import * as wrapper from "@/helpers/utils/wrapper";
import { BadRequestError } from "@/helpers/error";
import { ResponseResult } from "@/interfaces/wrapper-interface";
import ReviewsRepository from "@/modules/Reviews/repositories/reviews-repositories";
import { RatingType } from "@/generated/prisma";

export default class ReviewsService {
  static async submitDoctorRating(
    userId: number,
    doctorId: number,
    rating: number,
    review?: string,
  ): Promise<ResponseResult<any>> {
    try {
      if (rating < 1 || rating > 5)
        return wrapper.error(
          new BadRequestError("Rating must be between 1 and 5"),
        );

      const submission = await ReviewsRepository.submitRating(
        userId,
        rating,
        "DOCTOR",
        doctorId,
        review,
      );
      return wrapper.data(submission);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async submitProductRating(
    userId: number,
    productId: number,
    rating: number,
    review?: string,
  ): Promise<ResponseResult<any>> {
    try {
      if (rating < 1 || rating > 5)
        return wrapper.error(
          new BadRequestError("Rating must be between 1 and 5"),
        );

      // For product ratings, targetId and productId are effectively acting identically based on schema, storing both properly
      const submission = await ReviewsRepository.submitRating(
        userId,
        rating,
        "PRODUCT",
        productId,
        review,
        productId,
      );
      return wrapper.data(submission);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async getAverageRating(
    targetId: number,
    type: RatingType,
  ): Promise<ResponseResult<any>> {
    try {
      const avg = await ReviewsRepository.getAverageRating(targetId, type);
      return wrapper.data({ averageRating: avg, targetId, type });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }
}
