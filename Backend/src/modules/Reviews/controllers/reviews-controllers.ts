import * as wrapper from "@/helpers/utils/wrapper";
import {
  ERROR as httpError,
  SUCCESS as http,
} from "@/helpers/http-status/statusCode";
import logger from "@/helpers/utils/winston";
import { Request, Response } from "express";
import ReviewsService from "@/modules/Reviews/services/reviews-services";
import { RatingType } from "@/generated/prisma";

export const submitDoctorRating = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const doctorId = parseInt(req.params.doctorId as string, 10);
    const { rating, review } = req.body;

    const result = await ReviewsService.submitDoctorRating(
      userId,
      doctorId,
      rating,
      review,
    );

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to submit rating",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Rating submitted successfully",
      http.CREATED,
    );
  } catch (err: unknown) {
    logger.error(`Error submitting doctor rating: ${err instanceof Error ? err.message : String(err)}`);
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const submitProductRating = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const productId = parseInt(req.params.productId as string, 10);
    const { rating, review } = req.body;

    const result = await ReviewsService.submitProductRating(
      userId,
      productId,
      rating,
      review,
    );

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to submit product rating",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Product rating submitted successfully",
      http.CREATED,
    );
  } catch (err: unknown) {
    logger.error(`Error submitting product rating: ${err instanceof Error ? err.message : String(err)}`);
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const getAverageRating = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const targetId = parseInt(req.params.targetId as string, 10);
    const type = (req.params.type as string).toUpperCase() as RatingType;

    const result = await ReviewsService.getAverageRating(targetId, type);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to get average rating",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Average rating retrieved",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(`Error fetching average rating: ${err instanceof Error ? err.message : String(err)}`);
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};
