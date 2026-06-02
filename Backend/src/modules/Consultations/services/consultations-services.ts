import * as wrapper from "@/helpers/utils/wrapper";
import { NotFoundError, BadRequestError } from "@/helpers/error";
import { ResponseResult } from "@/interfaces/wrapper-interface";
import ConsultationsRepository from "@/modules/Consultations/repositories/consultations-repositories";
import prisma from "@/helpers/db/prisma/client";
import { ConsultationStatus } from "@/generated/prisma";
import { getIO } from "@/helpers/utils/socket";
import { snap, coreApi } from "@/helpers/utils/midtrans";
import crypto from "crypto";
import {
  RequestedConsultation,
  RespondedConsultation,
  UpdatedConsultationStatus,
  ProcessedPayment,
  ChatHistory,
  SentMessage,
  GeneratedPrescription,
  UpdatedPrescriptionNotes,
  AddedPrescriptionItem,
  PrescriptionItemsList,
} from "@/interfaces/consultations-interface";

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

  static async getConsultationById(consultationId: number): Promise<ResponseResult<any>> {
    try {
      const consultation = await ConsultationsRepository.getConsultationById(consultationId);
      if (!consultation) {
        return wrapper.error(new NotFoundError("Consultation not found"));
      }
      return wrapper.data(consultation);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async requestConsultation(
    patientId: number,
    doctorId: number,
    fee: number = 50000, // Default fee
  ): Promise<ResponseResult<RequestedConsultation>> {
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
  ): Promise<ResponseResult<RespondedConsultation>> {
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
  ): Promise<ResponseResult<UpdatedConsultationStatus>> {
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
      
      if (consultation.paymentStatus === "PAID") {
        return wrapper.error(new BadRequestError("Consultation is already paid"));
      }

      if (consultation.midtransToken && consultation.midtransUrl) {
        return wrapper.data(consultation);
      }

      const patient = await prisma.user.findUnique({
        where: { id: consultation.patientId },
      });

      // Build item_details: start with the consultation fee
      const itemDetails: {
        id: string;
        price: number;
        quantity: number;
        name: string;
      }[] = [
        {
          id: `CONS-FEE-${consultation.id}`,
          price: consultation.fee,
          quantity: 1,
          name: "Biaya Konsultasi Dokter",
        },
      ];

      // Add prescription items if available
      const prescriptionItems = consultation.prescription?.items ?? [];
      for (const item of prescriptionItems) {
        itemDetails.push({
          id: `PROD-${item.product.id}`,
          price: item.product.price,
          quantity: item.quantity,
          name: item.product.name,
        });
      }

      // Total gross amount = consultation fee + prescription items
      const grossAmount =
        itemDetails.reduce((sum, i) => sum + i.price * i.quantity, 0);

      const frontendUrl =
        process.env.FRONTEND_URL || "http://localhost:5173";

      const orderId = `CONS-${consultationId}-${Date.now()}`;

      const parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: grossAmount,
        },
        item_details: itemDetails,
        customer_details: {
          first_name: patient?.fullName || "Patient",
          email: patient?.email,
          phone: patient?.telephoneNumber,
        },
        callbacks: {
          finish: `${frontendUrl}/consultations/success`,
        },
      };

      const transaction = await snap.createTransaction(parameter);
      const updated = await ConsultationsRepository.updateMidtransData(
        consultationId,
        transaction.token,
        transaction.redirect_url,
        orderId, // ← save orderId so we can verify later
      );
      return wrapper.data(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async handleMidtransWebhook(body: any): Promise<ResponseResult<any>> {
    try {
      // In production, you might want to use coreApi.transaction.notification(body)
      // but Midtrans sends the JSON body directly, so we can verify the signature here.
      const statusResponse = body;
      const orderId = statusResponse.order_id;
      const transactionStatus = statusResponse.transaction_status;
      const fraudStatus = statusResponse.fraud_status;

      const signatureKey =
        statusResponse.order_id +
        statusResponse.status_code +
        statusResponse.gross_amount +
        (process.env.MIDTRANS_SERVER_KEY || "");
      const hash = crypto
        .createHash("sha512")
        .update(signatureKey)
        .digest("hex");

      if (hash !== statusResponse.signature_key) {
        return wrapper.error(new BadRequestError("Invalid signature key"));
      }

      const match = orderId.match(/^CONS-(\d+)-/);
      if (!match)
        return wrapper.error(new BadRequestError("Invalid order id format"));
      const consultationId = parseInt(match[1], 10);

      if (transactionStatus == "capture" || transactionStatus == "settlement") {
        if (fraudStatus == "challenge") {
          // Challenge state
        } else if (fraudStatus == "accept" || !fraudStatus) {
          await ConsultationsRepository.updatePaymentStatus(
            consultationId,
            "PAID",
          );
        }
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "deny" ||
        transactionStatus == "expire"
      ) {
        await ConsultationsRepository.updatePaymentStatus(
          consultationId,
          "REFUNDED", // Or CANCELLED / failed state
        );
      } else if (transactionStatus == "pending") {
        await ConsultationsRepository.updatePaymentStatus(
          consultationId,
          "PENDING",
        );
      }

      return wrapper.data({ success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  /**
   * Verify payment status by polling Midtrans transaction API.
   * Called from frontend after redirect from Midtrans payment page.
   * Essential for dev/sandbox where webhook cannot reach localhost.
   */
  static async verifyPaymentStatus(
    consultationId: number,
  ): Promise<ResponseResult<any>> {
    try {
      const consultation =
        await ConsultationsRepository.getConsultationById(consultationId);

      if (!consultation)
        return wrapper.error(new NotFoundError("Consultation not found"));

      // Already PAID — return immediately
      if (consultation.paymentStatus === "PAID") {
        return wrapper.data({
          paymentStatus: "PAID",
          consultationStatus: consultation.status,
          alreadyPaid: true,
        });
      }

      // midtransUrl now stores the order_id (set above)
      const orderId = consultation.midtransUrl;
      if (!orderId || !orderId.startsWith("CONS-")) {
        return wrapper.error(
          new BadRequestError("Payment has not been initiated yet"),
        );
      }

      // Query Midtrans for transaction status
      let transactionStatus: string | null = null;
      let fraudStatus: string | null = null;

      try {
        const statusRes = await (coreApi as any).transaction.status(orderId);
        transactionStatus = statusRes.transaction_status;
        fraudStatus = statusRes.fraud_status;
      } catch (midtransErr: any) {
        // 404 means transaction not found / not completed yet
        if (midtransErr?.httpStatusCode === 404 || midtransErr?.ApiResponse?.status_code === "404") {
          return wrapper.data({
            paymentStatus: "PENDING",
            consultationStatus: consultation.status,
            message: "Transaksi belum selesai di Midtrans",
          });
        }
        throw midtransErr;
      }

      // Update payment status based on Midtrans response
      if (
        transactionStatus === "capture" ||
        transactionStatus === "settlement"
      ) {
        if (!fraudStatus || fraudStatus === "accept") {
          await ConsultationsRepository.updatePaymentStatus(
            consultationId,
            "PAID",
          );
          return wrapper.data({
            paymentStatus: "PAID",
            consultationStatus: consultation.status,
          });
        }
      } else if (
        transactionStatus === "cancel" ||
        transactionStatus === "deny" ||
        transactionStatus === "expire"
      ) {
        await ConsultationsRepository.updatePaymentStatus(
          consultationId,
          "REFUNDED",
        );
      }

      const latest =
        await ConsultationsRepository.getConsultationById(consultationId);
      return wrapper.data({
        paymentStatus: latest?.paymentStatus ?? consultation.paymentStatus,
        consultationStatus: latest?.status ?? consultation.status,
        transactionStatus,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async getChatHistory(
    consultationId: number,
  ): Promise<ResponseResult<ChatHistory>> {
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
  ): Promise<ResponseResult<SentMessage>> {
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
  ): Promise<ResponseResult<GeneratedPrescription>> {
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
  ): Promise<ResponseResult<UpdatedPrescriptionNotes>> {
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
  ): Promise<ResponseResult<AddedPrescriptionItem>> {
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
  ): Promise<ResponseResult<{ success: boolean }>> {
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
  ): Promise<ResponseResult<PrescriptionItemsList>> {
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
