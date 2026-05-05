import * as wrapper from "@/helpers/utils/wrapper";
import {
  ERROR as httpError,
  SUCCESS as http,
} from "@/helpers/http-status/statusCode";
import logger from "@/helpers/utils/winston";
import { CookieOptions, Request, Response } from "express";
import { isValidPayload } from "@/helpers/utils/validator";
import {
  LoginUserSchema,
  RegisterUserSchema,
  RefreshTokenSchema,
  EditUserSchema,
} from "@/schemas/user-schema";
import UserService from "@/modules/Users/services/users-services";
import {
  RegisterUserDto,
  LoginUserDto,
  RefreshTokenDto,
} from "@/dtos/user-dto";
import { setAuthCookies, clearAuthCookies } from "@/helpers/utils/cookies";

export const userRegister =
  (roleToAssign: "PATIENT" | "DOCTOR" | "ADMIN" = "PATIENT") =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const payload: RegisterUserDto = { ...req.body };

      const validatePayload = await isValidPayload(payload, RegisterUserSchema);

      if (validatePayload.err) {
        return wrapper.response(
          res,
          "fail",
          { err: validatePayload.err, data: null },
          "Invalid Payload",
          httpError.BAD_REQUEST,
        );
      }

      const result = await UserService.createUserByRole(payload, roleToAssign);

      if (result.err) {
        return wrapper.response(
          res,
          "fail",
          result,
          "User Registration Failed",
          httpError.BAD_REQUEST,
        );
      }

      return wrapper.response(
        res,
        "success",
        result,
        "User Registration Successful",
        http.CREATED,
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      const error = err instanceof Error ? err : new Error(errorMessage);
      logger.error(
        `Unexpected error during user registration: ${errorMessage}`,
      );

      return wrapper.response(
        res,
        "fail",
        { err: error, data: null },
        "Registration Failed",
        httpError.INTERNAL_ERROR,
      );
    }
  };

export const userLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload: LoginUserDto = { ...req.body };

    const validatePayload = await isValidPayload(payload, LoginUserSchema);

    if (validatePayload.err) {
      return wrapper.response(
        res,
        "fail",
        { err: validatePayload.err, data: null },
        "Invalid Payload",
        httpError.BAD_REQUEST,
      );
    }

    const result = await UserService.login(payload);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Login Failed",
        httpError.UNAUTHORIZED,
      );
    }

    setAuthCookies(res, result.data.token, result.data.refreshToken);

    return wrapper.response(
      res,
      "success",
      result,
      "Login Successful",
      http.OK,
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred";
    const error = err instanceof Error ? err : new Error(errorMessage);
    logger.error(`Unexpected error during user login: ${errorMessage}`);

    return wrapper.response(
      res,
      "fail",
      { err: error, data: null },
      "Login Failed",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const userEdit = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = { ...req.body };
    const userId = (req as any).user.userId;

    const validatePayload = await isValidPayload(payload, EditUserSchema);

    if (validatePayload.err) {
      return wrapper.response(
        res,
        "fail",
        { err: validatePayload.err, data: null },
        "Invalid Payload",
        httpError.BAD_REQUEST,
      );
    }

    const result = await UserService.updateProfile(userId, payload);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Update Failed",
        httpError.BAD_REQUEST,
      );
    }

    return wrapper.response(
      res,
      "success",
      result,
      "User updated successfully",
      http.OK,
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred";
    const error = err instanceof Error ? err : new Error(errorMessage);
    logger.error(`Unexpected error during user edit: ${errorMessage}`);

    return wrapper.response(
      res,
      "fail",
      { err: error, data: null },
      "Update Failed",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const result = await UserService.getRoleProfile(userId);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Fetch failed",
        httpError.NOT_FOUND,
      );
    }
    return wrapper.response(res, "success", result, "Profile fetched", http.OK);
  } catch (err: unknown) {
    logger.error(
      `Error fetching profile: ${err instanceof Error ? err.message : String(err)}`,
    );
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Fetch failed",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const payload = { ...req.body };

    // Add validation later if needed
    const result = await UserService.updatePassword(userId, payload);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Update failed",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Password updated",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(
      `Error updating password: ${err instanceof Error ? err.message : String(err)}`,
    );
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Update failed",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const getAddresses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const result = await UserService.getAddresses(userId);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Fetch failed",
        httpError.NOT_FOUND,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Addresses fetched",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(
      `Error fetching addresses: ${err instanceof Error ? err.message : String(err)}`,
    );
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Fetch failed",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const addAddress = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const payload = { ...req.body };

    const result = await UserService.addAddress(userId, payload);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Add address failed",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Address added",
      http.CREATED,
    );
  } catch (err: unknown) {
    logger.error(
      `Error adding address: ${err instanceof Error ? err.message : String(err)}`,
    );
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Add failed",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await UserService.getAllUsers();

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to fetch users",
        httpError.BAD_REQUEST,
      );
    }

    return wrapper.response(res, "success", result, "Users fetched", http.OK);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred";
    const error = err instanceof Error ? err : new Error(errorMessage);
    logger.error(`Unexpected error during users fetch: ${errorMessage}`);

    return wrapper.response(
      res,
      "fail",
      { err: error, data: null },
      "Fetch users failed",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const refreshTokenFromCookie =
      typeof req.cookies?.refreshToken === "string"
        ? req.cookies.refreshToken
        : "";
    const refreshTokenFromBody =
      typeof req.body?.refreshToken === "string" ? req.body.refreshToken : "";

    const payload: RefreshTokenDto = {
      refreshToken: refreshTokenFromCookie || refreshTokenFromBody,
    };

    const validatePayload = await isValidPayload(payload, RefreshTokenSchema);

    if (validatePayload.err) {
      return wrapper.response(
        res,
        "fail",
        { err: validatePayload.err, data: null },
        "Invalid Payload",
        httpError.BAD_REQUEST,
      );
    }

    const result = await UserService.refreshToken(payload);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Refresh Token Failed",
        httpError.UNAUTHORIZED,
      );
    }

    setAuthCookies(res, result.data.token, result.data.refreshToken);

    return wrapper.response(res, "success", result, "Token Refreshed", http.OK);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred";
    const error = err instanceof Error ? err : new Error(errorMessage);
    logger.error(`Unexpected error during refresh token: ${errorMessage}`);

    return wrapper.response(
      res,
      "fail",
      { err: error, data: null },
      "Refresh Token Failed",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const userLogout = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    clearAuthCookies(res);
    return wrapper.response(
      res,
      "success",
      wrapper.data({ loggedOut: true }),
      "Logout Successful",
      http.OK,
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred";
    const error = err instanceof Error ? err : new Error(errorMessage);
    logger.error(`Unexpected error during user logout: ${errorMessage}`);

    return wrapper.response(
      res,
      "fail",
      { err: error, data: null },
      "Logout Failed",
      httpError.INTERNAL_ERROR,
    );
  }
};
