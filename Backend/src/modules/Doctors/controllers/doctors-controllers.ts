import * as wrapper from "@/helpers/utils/wrapper";
import {
  ERROR as httpError,
  SUCCESS as http,
} from "@/helpers/http-status/statusCode";
import { ResponseResult } from "@/interfaces/wrapper-interface";
import logger from "@/helpers/utils/winston";
import { Request, Response } from "express";
import { isValidPayload } from "@/helpers/utils/validator";
import DoctorsService from "@/modules/Doctors/services/doctors-services";

export const getAllSpecializations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await DoctorsService.getAllSpecializations();

    if (result.err)
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to fetch specializations",
        httpError.BAD_REQUEST,
      );
    return wrapper.response(
      res,
      "success",
      result,
      "Specializations fetched",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(
      `Error fetching specializations: ${err instanceof Error ? err.message : String(err)}`,
    );
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const createSpecialization = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, description } = req.body;
    const result = await DoctorsService.createSpecialization(name, description);

    if (result.err)
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to create specialization",
        httpError.BAD_REQUEST,
      );
    return wrapper.response(
      res,
      "success",
      result,
      "Specialization created",
      http.CREATED,
    );
  } catch (err: unknown) {
    logger.error(
      `Error creating specialization: ${err instanceof Error ? err.message : String(err)}`,
    );
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const getDoctorsBySpecialization = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const specId = parseInt(req.params.specId as string, 10);
    const result = await DoctorsService.getDoctorsBySpecialization(specId);

    if (result.err)
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to fetch doctors",
        httpError.BAD_REQUEST,
      );
    return wrapper.response(res, "success", result, "Doctors fetched", http.OK);
  } catch (err: unknown) {
    logger.error(
      `Error fetching doctors by specialization: ${err instanceof Error ? err.message : String(err)}`,
    );
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const updateCredentials = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { strNumber } = req.body;

    const result = await DoctorsService.updateCredentials(userId, strNumber);

    if (result.err)
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to update credentials",
        httpError.BAD_REQUEST,
      );
    return wrapper.response(
      res,
      "success",
      result,
      "Credentials updated",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(
      `Error updating credentials: ${err instanceof Error ? err.message : String(err)}`,
    );
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const updatePhoto = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { photoUrl } = req.body;

    const result = await DoctorsService.updatePhoto(userId, photoUrl);

    if (result.err)
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to update photo",
        httpError.BAD_REQUEST,
      );
    return wrapper.response(res, "success", result, "Photo updated", http.OK);
  } catch (err: unknown) {
    logger.error(
      `Error updating photo: ${err instanceof Error ? err.message : String(err)}`,
    );
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const getConsultationHistory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const result = await DoctorsService.getConsultationHistory(userId);

    if (result.err)
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to get consultation history",
        httpError.BAD_REQUEST,
      );
    return wrapper.response(
      res,
      "success",
      result,
      "Consultation history retrieved",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(
      `Error fetching consultation history: ${err instanceof Error ? err.message : String(err)}`,
    );
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};
