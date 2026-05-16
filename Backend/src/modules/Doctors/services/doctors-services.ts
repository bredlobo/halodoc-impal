import * as wrapper from "@/helpers/utils/wrapper";
import { BadRequestError, NotFoundError } from "@/helpers/error";
import { ResponseResult } from "@/interfaces/wrapper-interface";
import DoctorsRepository from "@/modules/Doctors/repositories/doctors-repositories";
import {
  SpecializationList,
  CreatedSpecialization,
  DoctorsBySpecialization,
  UpdatedDoctorCredentials,
  UpdatedDoctorPhoto,
  ConsultationHistory,
} from "@/interfaces/doctors-interface";

export default class DoctorsService {
  static async getAllSpecializations(): Promise<
    ResponseResult<SpecializationList>
  > {
    try {
      const specs = await DoctorsRepository.getAllSpecializations();
      return wrapper.data(specs);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async getAllDoctors(): Promise<ResponseResult<any>> {
    try {
      const doctors = await DoctorsRepository.getAllDoctors();
      return wrapper.data(doctors);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async createSpecialization(
    name: string,
    description?: string,
  ): Promise<ResponseResult<CreatedSpecialization>> {
    try {
      const spec = await DoctorsRepository.createSpecialization(
        name,
        description,
      );
      return wrapper.data(spec);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async getDoctorsBySpecialization(
    specId: number,
  ): Promise<ResponseResult<DoctorsBySpecialization>> {
    try {
      const doctors =
        await DoctorsRepository.getDoctorsBySpecialization(specId);
      return wrapper.data(doctors);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async updateCredentials(
    userId: number,
    strNumber: string,
  ): Promise<ResponseResult<UpdatedDoctorCredentials>> {
    try {
      const doc = await DoctorsRepository.findDoctorProfileByUserId(userId);
      if (!doc)
        return wrapper.error(new NotFoundError("Doctor profile not found"));

      const updated = await DoctorsRepository.updateCredentials(
        doc.id,
        strNumber,
      );
      return wrapper.data(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async updatePhoto(
    userId: number,
    photoUrl: string,
  ): Promise<ResponseResult<UpdatedDoctorPhoto>> {
    try {
      const doc = await DoctorsRepository.findDoctorProfileByUserId(userId);
      if (!doc)
        return wrapper.error(new NotFoundError("Doctor profile not found"));

      const updated = await DoctorsRepository.updatePhoto(doc.id, photoUrl);
      return wrapper.data(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async getConsultationHistory(
    userId: number,
  ): Promise<ResponseResult<ConsultationHistory>> {
    try {
      const doctorProfile =
        await DoctorsRepository.findDoctorProfileByUserId(userId);
      if (!doctorProfile) {
        return wrapper.error(new NotFoundError("Doctor profile not found"));
      }

      // User requested doctorProfile.id, but Consultation schema maps doctorId to User.id.
      // So we use doctorProfile.userId (which is identical to userId) to avoid query mismatch.
      const history = await DoctorsRepository.getConsultationHistory(
        doctorProfile.userId,
      );
      return wrapper.data(history);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }
}
