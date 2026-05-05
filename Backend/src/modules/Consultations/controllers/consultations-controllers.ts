import * as wrapper from "@/helpers/utils/wrapper";
import {
  ERROR as httpError,
  SUCCESS as http,
} from "@/helpers/http-status/statusCode";
import logger from "@/helpers/utils/winston";
import { Request, Response } from "express";
import ConsultationsService from "@/modules/Consultations/services/consultations-services";
import { ConsultationStatus } from "@/generated/prisma";

export const requestConsultation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const patientId = (req as any).user.userId;
    const { doctorId } = req.body;
    const result = await ConsultationsService.requestConsultation(
      patientId,
      doctorId,
    );

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to request consultation",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Consultation requested",
      http.CREATED,
    );
  } catch (err: unknown) {
    logger.error(`Error requesting consultation: ${err instanceof Error ? err.message : String(err)}`);
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const updateStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const consultationId = parseInt(req.params.id as string, 10);
    const { status } = req.body;
    const result = await ConsultationsService.updateStatus(
      consultationId,
      status as ConsultationStatus,
    );

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to update status",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(res, "success", result, "Status updated", http.OK);
  } catch (err: unknown) {
    logger.error(`Error updating consultation status: ${err instanceof Error ? err.message : String(err)}`);
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const processPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const consultationId = parseInt(req.params.id as string, 10);
    const result = await ConsultationsService.processPayment(consultationId);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to process payment",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Payment processed",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(`Error processing payment: ${err instanceof Error ? err.message : String(err)}`);
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const getChatHistory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const consultationId = parseInt(req.params.id as string, 10);
    const result = await ConsultationsService.getChatHistory(consultationId);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to get chat history",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Chat history retrieved",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(`Error fetching chat history: ${err instanceof Error ? err.message : String(err)}`);
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const senderId = (req as any).user.userId;
    const consultationId = parseInt(req.params.id as string, 10);
    const { content } = req.body;

    const result = await ConsultationsService.sendMessage(
      consultationId,
      senderId,
      content,
    );

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to send message",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Message sent",
      http.CREATED,
    );
  } catch (err: unknown) {
    logger.error(`Error sending message: ${err instanceof Error ? err.message : String(err)}`);
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const generatePrescription = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const consultationId = parseInt(req.params.id as string, 10);
    const { notes } = req.body;

    const result = await ConsultationsService.generatePrescription(
      consultationId,
      notes,
    );

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to generate prescription",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Prescription generated",
      http.CREATED,
    );
  } catch (err: unknown) {
    logger.error(`Error generating prescription: ${err instanceof Error ? err.message : String(err)}`);
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const updatePrescriptionNotes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const prescriptionId = parseInt(req.params.prescriptionId as string, 10);
    const { notes } = req.body;

    const result = await ConsultationsService.updatePrescriptionNotes(
      prescriptionId,
      notes,
    );

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to update prescription notes",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Prescription notes updated",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(`Error updating prescription notes: ${err instanceof Error ? err.message : String(err)}`);
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const addPrescriptionItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const prescriptionId = parseInt(req.params.prescriptionId as string, 10);
    const { productId, dosage, quantity } = req.body;

    const result = await ConsultationsService.addPrescriptionItem(
      prescriptionId,
      { productId, dosage, quantity },
    );

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to add prescription item",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Prescription item added",
      http.CREATED,
    );
  } catch (err: unknown) {
    logger.error(`Error adding prescription item: ${err instanceof Error ? err.message : String(err)}`);
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const removePrescriptionItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const itemId = parseInt(req.params.itemId as string, 10);
    const result = await ConsultationsService.removePrescriptionItem(itemId);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to remove prescription item",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Prescription item removed",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(`Error removing prescription item: ${err instanceof Error ? err.message : String(err)}`);
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};
