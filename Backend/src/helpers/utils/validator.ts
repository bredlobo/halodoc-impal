import * as wrapper from "./wrapper";
import { NotFoundError, ValidationError } from "@/helpers/error";
import { z, ZodSchema } from "zod";
import { ValidationResult } from "@/interfaces/users-interface";

export const isValidPayload = async <T>(
  payload: T,
  model: ZodSchema<T>,
): Promise<ValidationResult<T>> => {
  try {
    console.log(payload);
    const validateData = await model.parse(payload);

    return wrapper.data(validateData);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors: Record<string, string> = {};

      err.issues.forEach((issue) => {
        const field = issue.path.length > 0 ? String(issue.path[0]) : "payload";

        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });

      return wrapper.error(new ValidationError("Validation Error", errors));
    }

    return wrapper.error(new NotFoundError("An unexpected error occurred."));
  }
};
