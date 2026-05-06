import DoctorsRepository from "@/modules/Doctors/repositories/doctors-repositories";

export type SpecializationList = Awaited<
  ReturnType<typeof DoctorsRepository.getAllSpecializations>
>;

export type CreatedSpecialization = Awaited<
  ReturnType<typeof DoctorsRepository.createSpecialization>
>;

export type DoctorsBySpecialization = Awaited<
  ReturnType<typeof DoctorsRepository.getDoctorsBySpecialization>
>;

export type UpdatedDoctorCredentials = Awaited<
  ReturnType<typeof DoctorsRepository.updateCredentials>
>;

export type UpdatedDoctorPhoto = Awaited<
  ReturnType<typeof DoctorsRepository.updatePhoto>
>;

export type ConsultationHistory = Awaited<
  ReturnType<typeof DoctorsRepository.getConsultationHistory>
>;
