import CommonError from "./commonError";

export type ValidationErrorMap = Record<string, string>;

class ValidationError extends CommonError {
  public readonly errors: ValidationErrorMap;

  constructor(
    message: string = "Validation Error",
    errors: ValidationErrorMap = {},
  ) {
    super(message);
    this.errors = errors;
  }
}

export default ValidationError;
