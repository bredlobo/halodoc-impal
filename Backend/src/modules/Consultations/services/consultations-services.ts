import * as wrapper from "@/helpers/utils/wrapper";
import { NotFoundError, BadRequestError } from "@/helpers/error";
import { ResponseResult } from "@/interfaces/wrapper-interface";
import ConsultationsRepository from "@/modules/Consultations/repositories/consultations-repositories";
import prisma from "@/helpers/db/prisma/client";
import { ConsultationStatus } from "@/generated/prisma";
import { getIO } from "@/helpers/utils/socket";

export default class ConsultationsService {
  private static timeoutJobs: Map<number, NodeJS.Timeout> = new Map();

  private static scheduleTimeout(
    consultationId: number,
    patientId: number,
  ): void {
    const timeout = setTimeout(
      async () => {
        try {
          const consultation =
            await ConsultationsRepository.getConsultationById(consultationId);
          if (consultation && consultation.status === "REQUESTED") {
            await ConsultationsRepository.updateStatus(
              consultationId,
              "CANCELLED",
            );
            getIO().to(`user_${patientId}`).emit("consultation_timeout", {
              consultationId,
              message: "Consultation request timed out",
            });
            ConsultationsService.timeoutJobs.delete(consultationId);
          }
        } catch (err) {
          console.error("Error in consultation timeout job:", err);
        }
      },
      5 * 60 * 1000,
    ); // 5 minutes

    ConsultationsService.timeoutJobs.set(consultationId, timeout);
  }

  private static cancelTimeout(consultationId: number): void {
    const job = ConsultationsService.timeoutJobs.get(consultationId);
    if (job) {
      clearTimeout(job);
      ConsultationsService.timeoutJobs.delete(consultationId);
    }
  }

  static async requestConsultation(
    patientId: number,
    doctorId: number,
    fee: number = 50000, // Default fee
  ): Promise<ResponseResult<any>> {
    try {
      const patient = await prisma.user.findUnique({
        where: { id: patientId },
      });
      if (!patient)
        return wrapper.error(new NotFoundError("Patient not found"));

      const consultation = await ConsultationsRepository.requestConsultation(
        patientId,
        doctorId,
        fee,
      );

      // Schedule 5-minute timeout
      ConsultationsService.scheduleTimeout(consultation.id, patientId);

      // Extract details for the event
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      // Emit socket event to the doctor's room
      getIO().to(`user_${doctorId}`).emit("new_consultation_request", {
        consultationId: consultation.id,
        patientName: patient.fullName,
        status: "REQUESTED",
        expiresAt: expiresAt.toISOString(),
        remainingSeconds: 300,
      });

      return wrapper.data(consultation);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async respondToConsultation(
    consultationId: number,
    doctorId: number,
    action: "ACCEPT" | "DECLINE",
  ): Promise<ResponseResult<any>> {
    try {
      const consultation =
        await ConsultationsRepository.getConsultationById(consultationId);
      if (!consultation)
        return wrapper.error(new NotFoundError("Consultation not found"));
      if (consultation.doctorId !== doctorId) {
        return wrapper.error(
          new BadRequestError("Unauthorized doctor for this consultation"),
        );
      }
      if (consultation.status !== "REQUESTED") {
        return wrapper.error(
          new BadRequestError("Consultation is not in REQUESTED status"),
        );
      }

      // Check if it already expired
      const createdAt = new Date(consultation.createdAt).getTime();
      const isExpired = Date.now() - createdAt > 5 * 60 * 1000;
      if (isExpired) {
        return wrapper.error(
          new BadRequestError("Consultation request has expired"),
        );
      }

      const doctor = await prisma.user.findUnique({ where: { id: doctorId } });
      const doctorName = doctor ? doctor.fullName : "Doctor";

      ConsultationsService.cancelTimeout(consultationId);

      if (action === "ACCEPT") {
        const updated = await prisma.consultation.update({
          where: { id: consultationId },
          data: { status: "ONGOING", startTime: new Date() },
        });

        getIO()
          .to(`user_${consultation.patientId}`)
          .emit("consultation_accepted", {
            consultationId,
            doctorName,
          });

        getIO()
          .to(`consultation_${consultationId}`)
          .emit("consultation_started", {
            consultationId,
            startTime: updated.startTime,
          });

        return wrapper.data(updated);
      } else if (action === "DECLINE") {
        const updated = await ConsultationsRepository.updateStatus(
          consultationId,
          "CANCELLED",
        );

        getIO()
          .to(`user_${consultation.patientId}`)
          .emit("consultation_declined", {
            consultationId,
            message: "Doctor declined the consultation",
          });

        return wrapper.data(updated);
      }

      return wrapper.error(new BadRequestError("Invalid action"));
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
