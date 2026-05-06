import ConsultationsRepository from "@/modules/Consultations/repositories/consultations-repositories";

export type RequestedConsultation = Awaited<
  ReturnType<typeof ConsultationsRepository.requestConsultation>
>;

export type RespondedConsultation = Awaited<
  ReturnType<typeof ConsultationsRepository.updateStatus>
>;

export type UpdatedConsultationStatus = Awaited<
  ReturnType<typeof ConsultationsRepository.updateStatus>
>;

export type ProcessedPayment = Awaited<
  ReturnType<typeof ConsultationsRepository.processPayment>
>;

export type ChatHistory = Awaited<
  ReturnType<typeof ConsultationsRepository.getChatHistory>
>;

export type SentMessage = Awaited<
  ReturnType<typeof ConsultationsRepository.sendMessage>
>;

export type GeneratedPrescription = Awaited<
  ReturnType<typeof ConsultationsRepository.generatePrescription>
>;

export type UpdatedPrescriptionNotes = Awaited<
  ReturnType<typeof ConsultationsRepository.updatePrescriptionNotes>
>;

export type AddedPrescriptionItem = Awaited<
  ReturnType<typeof ConsultationsRepository.addPrescriptionItem>
>;

export type PrescriptionItemsList = Awaited<
  ReturnType<typeof ConsultationsRepository.getPrescriptionItems>
>;
