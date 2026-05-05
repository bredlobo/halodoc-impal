import * as wrapper from "@/helpers/utils/wrapper";
import { NotFoundError, BadRequestError } from "@/helpers/error";
import { ResponseResult } from "@/interfaces/wrapper-interface";
import ConsultationsRepository from "@/modules/Consultations/repositories/consultations-repositories";
import { ConsultationStatus } from "@/generated/prisma";

export default class ConsultationsService {
  static async requestConsultation(
    patientId: number,
    doctorId: number,
    fee: number = 0,
  ): Promise<ResponseResult<any>> {
    try {
      const consultation = await ConsultationsRepository.requestConsultation(
        patientId,
        doctorId,
        fee,
      );
      return wrapper.data(consultation);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async updateStatus(
    consultationId: number,
    status: ConsultationStatus,
  ): Promise<ResponseResult<any>> {
    try {
      const consultation =
        await ConsultationsRepository.getConsultationById(consultationId);
      if (!consultation)
        return wrapper.error(new NotFoundError("Consultation not found"));

      const updated = await ConsultationsRepository.updateStatus(
        consultationId,
        status,
      );
      return wrapper.data(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async processPayment(
    consultationId: number,
  ): Promise<ResponseResult<any>> {
    try {
      const consultation =
        await ConsultationsRepository.getConsultationById(consultationId);
      if (!consultation)
        return wrapper.error(new NotFoundError("Consultation not found"));

      const updated =
        await ConsultationsRepository.processPayment(consultationId);
      return wrapper.data(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async getChatHistory(
    consultationId: number,
  ): Promise<ResponseResult<any>> {
    try {
      const history =
        await ConsultationsRepository.getChatHistory(consultationId);
      return wrapper.data(history);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async sendMessage(
    consultationId: number,
    senderId: number,
    content: string,
  ): Promise<ResponseResult<any>> {
    try {
      const message = await ConsultationsRepository.sendMessage(
        consultationId,
        senderId,
        content,
      );
      return wrapper.data(message);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async generatePrescription(
    consultationId: number,
    notes?: string,
  ): Promise<ResponseResult<any>> {
    try {
      const consultation =
        await ConsultationsRepository.getConsultationById(consultationId);
      if (!consultation)
        return wrapper.error(new NotFoundError("Consultation not found"));

      const auth = await ConsultationsRepository.generatePrescription(
        consultationId,
        notes,
      );
      return wrapper.data(auth);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async updatePrescriptionNotes(
    prescriptionId: number,
    notes: string,
  ): Promise<ResponseResult<any>> {
    try {
      const auth = await ConsultationsRepository.updatePrescriptionNotes(
        prescriptionId,
        notes,
      );
      return wrapper.data(auth);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async addPrescriptionItem(
    prescriptionId: number,
    item: { productId: number; dosage: string; quantity: number },
  ): Promise<ResponseResult<any>> {
    try {
      const auth = await ConsultationsRepository.addPrescriptionItem(
        prescriptionId,
        item.productId,
        item.dosage,
        item.quantity,
      );
      return wrapper.data(auth);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async removePrescriptionItem(
    itemId: number,
  ): Promise<ResponseResult<any>> {
    try {
      await ConsultationsRepository.removePrescriptionItem(itemId);
      return wrapper.data({ success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async getPrescriptionItems(
    prescriptionId: number,
  ): Promise<ResponseResult<any>> {
    try {
      const items =
        await ConsultationsRepository.getPrescriptionItems(prescriptionId);
      return wrapper.data(items);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }
}
