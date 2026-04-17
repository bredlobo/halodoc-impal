import * as wrapper from "@/helpers/utils/wrapper";
import {
  ERROR as httpError,
  SUCCESS as http,
} from "@/helpers/http-status/statusCode";
import logger from "@/helpers/utils/winston";
import { Request, Response } from "express";
import PharmacyService from "@/modules/Pharmacy/services/pharmacy-services";

export const createCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const payload = { ...req.body };
    const result = await PharmacyService.createCategory(payload);
    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to create category",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Category created successfully",
      http.CREATED,
    );
  } catch (err: unknown) {
    logger.error(`Error creating category: ${err instanceof Error ? err.message : String(err)}`);
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const getProductsByCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.categoryId as string, 10);
    const result = await PharmacyService.getProductsByCategory(categoryId);
    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to fetch products",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Products fetched successfully",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(`Error fetching products: ${err instanceof Error ? err.message : String(err)}`);
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const payload = { ...req.body };
    const result = await PharmacyService.createProduct(payload);
    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to create product",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Product created successfully",
      http.CREATED,
    );
  } catch (err: unknown) {
    logger.error(`Error creating product: ${err instanceof Error ? err.message : String(err)}`);
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const updateStock = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId as string, 10);
    const { quantity } = req.body;
    const result = await PharmacyService.updateStock(productId, quantity);
    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to update stock",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Stock updated successfully",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(`Error updating stock: ${err instanceof Error ? err.message : String(err)}`);
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const updatePrice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId as string, 10);
    const { newPrice } = req.body;
    const result = await PharmacyService.updatePrice(productId, newPrice);
    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to update price",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Price updated successfully",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(`Error updating price: ${err instanceof Error ? err.message : String(err)}`);
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const checkAvailability = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId as string, 10);
    const requiredQty = parseInt(req.query.requiredQty as string, 10);
    const result = await PharmacyService.checkAvailability(
      productId,
      requiredQty,
    );
    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to check availability",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Availability checked",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(`Error checking availability: ${err instanceof Error ? err.message : String(err)}`);
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};
