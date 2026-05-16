import prisma from "@/helpers/db/prisma/client";

export default class DoctorsRepository {
  static async getAllSpecializations() {
    return prisma.specialization.findMany({
      orderBy: { id: "asc" },
    });
  }

  static async createSpecialization(name: string, description?: string) {
    return prisma.specialization.create({
      data: {
        name,
        description,
      },
    });
  }

  static async getAllDoctors() {
    return prisma.doctorProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            telephoneNumber: true,
          },
        },
        specialization: true,
      },
    });
  }

  static async getDoctorsBySpecialization(specializationId: number) {
    return prisma.doctorProfile.findMany({
      where: { specializationId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            telephoneNumber: true,
          },
        },
      },
    });
  }

  static async updateCredentials(doctorId: number, strNumber: string) {
    return prisma.doctorProfile.update({
      where: { id: doctorId },
      data: { strNumber },
    });
  }

  static async updatePhoto(doctorId: number, photoUrl: string) {
    return prisma.doctorProfile.update({
      where: { id: doctorId },
      data: { photoUrl },
    });
  }

  static async getConsultationHistory(doctorId: number) {
    return prisma.consultation.findMany({
      where: { doctorId },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            email: true,
            telephoneNumber: true,
          },
        },
        prescription: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findDoctorProfileByUserId(userId: number) {
    return prisma.doctorProfile.findUnique({
      where: { userId },
    });
  }
}
