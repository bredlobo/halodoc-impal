import prisma from "@/helpers/db/prisma/client";
import { ConsultationStatus, PaymentStatus } from "@/generated/prisma";

export default class ConsultationsRepository {
  static async cancelExpiredConsultations() {
    return prisma.consultation.updateMany({
      where: {
        status: "REQUESTED",
        createdAt: { lt: new Date(Date.now() - 5 * 60 * 1000) },
      },
      data: { status: "CANCELLED" },
    });
  }

  static async requestConsultation(
    patientId: number,
    doctorId: number,
    fee: number,
  ) {
    return prisma.consultation.create({
      data: {
        patientId,
        doctorId,
        fee,
      },
    });
  }

  static async updateStatus(
    consultationId: number,
    status: ConsultationStatus,
  ) {
    return prisma.consultation.update({
      where: { id: consultationId },
      data: { status },
    });
  }

  static async processPayment(consultationId: number) {
    return prisma.consultation.update({
      where: { id: consultationId },
      data: { paymentStatus: "PAID" },
    });
  }

  static async getChatHistory(consultationId: number) {
    return prisma.message.findMany({
      where: { consultationId },
      orderBy: { timestamp: "asc" },
    });
  }

  static async sendMessage(
    consultationId: number,
    senderId: number,
    content: string,
  ) {
    return prisma.message.create({
      data: {
        consultationId,
        senderId,
        content,
      },
    });
  }

  static async generatePrescription(consultationId: number, notes?: string) {
    return prisma.prescription.create({
      data: {
        consultationId,
        notes,
      },
    });
  }

  static async updatePrescriptionNotes(prescriptionId: number, notes: string) {
    return prisma.prescription.update({
      where: { id: prescriptionId },
      data: { notes },
    });
  }

  static async addPrescriptionItem(
    prescriptionId: number,
    productId: number,
    dosage: string,
    quantity: number,
  ) {
    return prisma.prescriptionItem.create({
      data: {
        prescriptionId,
        productId,
        dosage,
        quantity,
      },
    });
  }

  static async removePrescriptionItem(itemId: number) {
    return prisma.prescriptionItem.delete({
      where: { id: itemId },
    });
  }

  static async getPrescriptionItems(prescriptionId: number) {
    return prisma.prescriptionItem.findMany({
      where: { prescriptionId },
      include: { product: true },
    });
  }

  static async getConsultationById(id: number) {
    return prisma.consultation.findUnique({
      where: { id },
      include: { prescription: true },
    });
  }
}
