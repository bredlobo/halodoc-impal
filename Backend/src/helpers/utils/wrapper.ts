import {
  NotFoundError,
  InternalServerError,
  BadRequestError,
  ConflictError,
  ExpectationFailedError,
  ForbiddenError,
  GatewayTimeoutError,
  ServiceUnavailableError,
  UnauthorizedError,
  ValidationError,
} from "@/helpers/error/index";
import { Response } from "express";
import { ERROR as httpError } from "@/helpers/http-status/statusCode";

import {
  ApiResponse,
  ErrorResponse,
  SuccessResponse,
  ResponseResult,
} from "@/interfaces/wrapper-interface";

const response = <T>(
  res: Response,
  type: "success" | "fail",
  result: ResponseResult<T>,
  message: string = "",
  code: number = 200,
): void => {
  let status = type === "success";
  let data = type === "success" ? (result as SuccessResponse<T>).data : null;
  let errors: Record<string, string> | undefined;

  if (type === "fail") {
    status = false;
    data = null;
    const error = result as ErrorResponse;
    message = error.err.message || message;
    code = checkErrorCode(error.err);

    if (error.err instanceof ValidationError) {
      errors = error.err.errors;
    }
  }

  const apiResponse: ApiResponse<T> = {
    status,
    data,
    message,
    code,
    ...(errors ? { errors } : {}),
  };

  res.status(code).json(apiResponse);
};

const checkErrorCode = (error: Error): number => {
  switch (error.constructor) {
    case ValidationError:
      return httpError.BAD_REQUEST;
    case BadRequestError:
      return httpError.BAD_REQUEST;
    case ConflictError:
      return httpError.CONFLICT;
    case ExpectationFailedError:
      return httpError.EXPECTATION_FAILED;
    case ForbiddenError:
      return httpError.FORBIDDEN;
    case GatewayTimeoutError:
      return httpError.GATEWAY_TIMEOUT;
    case InternalServerError:
      return httpError.INTERNAL_ERROR;
    case NotFoundError:
      return httpError.NOT_FOUND;
    case ServiceUnavailableError:
      return httpError.SERVICE_UNAVAILABLE;
    case UnauthorizedError:
      return httpError.UNAUTHORIZED;
    default:
      return httpError.INTERNAL_ERROR;
  }
};

const data = <T>(data: T): SuccessResponse<T> => ({ err: null, data });
const error = (err: Error): ErrorResponse => ({ err, data: null });

export { data, error, response };
