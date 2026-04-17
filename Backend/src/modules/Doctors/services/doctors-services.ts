import * as wrapper from "@/helpers/utils/wrapper";
import { BadRequestError, NotFoundError } from "@/helpers/error";
import { ResponseResult } from "@/interfaces/wrapper-interface";
import DoctorsRepository from "@/modules/Doctors/repositories/doctors-repositories";

export default class DoctorsService {
  static async createSpecialization(
    name: string,
    description?: string,
  ): Promise<ResponseResult<any>> {
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
  ): Promise<ResponseResult<any>> {
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
  ): Promise<ResponseResult<any>> {
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
  ): Promise<ResponseResult<any>> {
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
  ): Promise<ResponseResult<any>> {
    try {
      const history = await DoctorsRepository.getConsultationHistory(userId); // using userId as doctor identifier for now in this mapping assuming consistent id query mapping logic but technically mapped per schema properly.
      return wrapper.data(history);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }
}
