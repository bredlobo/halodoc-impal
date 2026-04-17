import * as wrapper from "@/helpers/utils/wrapper";
import {
  ERROR as httpError,
  SUCCESS as http,
} from "@/helpers/http-status/statusCode";
import logger from "@/helpers/utils/winston";
import { Request, Response } from "express";
import EcommerceService from "@/modules/Ecommerce/services/ecommerce-services";
import { OrderStatus } from "@/generated/prisma";
import { isValidPayload } from "@/helpers/utils/validator";
import {
  AdminCreateProductSchema,
  AdminUpdateProductSchema,
} from "@/schemas/ecommerce-schema";

export const createProductByAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const payload = { ...req.body };
    const validatePayload = await isValidPayload(
      payload,
      AdminCreateProductSchema,
    );

    if (validatePayload.err || !validatePayload.data) {
      return wrapper.response(
        res,
        "fail",
        wrapper.error(validatePayload.err ?? new Error("Invalid payload")),
        "Invalid payload",
        httpError.BAD_REQUEST,
      );
    }

    const result = await EcommerceService.createProductByAdmin(
      validatePayload.data,
    );

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
    logger.error(
      `Error creating product by admin: ${err instanceof Error ? err.message : String(err)}`,
    );
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const updateProductByAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId as string, 10);
    const payload = { ...req.body };
    const validatePayload = await isValidPayload(
      payload,
      AdminUpdateProductSchema,
    );

    if (validatePayload.err || !validatePayload.data) {
      return wrapper.response(
        res,
        "fail",
        wrapper.error(validatePayload.err ?? new Error("Invalid payload")),
        "Invalid payload",
        httpError.BAD_REQUEST,
      );
    }

    const result = await EcommerceService.updateProductByAdmin(
      productId,
      validatePayload.data,
    );

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to update product",
        httpError.BAD_REQUEST,
      );
    }

    return wrapper.response(
      res,
      "success",
      result,
      "Product updated successfully",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(
      `Error updating product by admin: ${err instanceof Error ? err.message : String(err)}`,
    );
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const deleteProductByAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId as string, 10);
    const result = await EcommerceService.deleteProductByAdmin(productId);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to delete product",
        httpError.BAD_REQUEST,
      );
    }

    return wrapper.response(
      res,
      "success",
      result,
      "Product deleted successfully",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(
      `Error deleting product by admin: ${err instanceof Error ? err.message : String(err)}`,
    );
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const result = await EcommerceService.getCart(userId);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to fetch cart",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Cart fetched successfully",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(
      `Error fetching cart: ${err instanceof Error ? err.message : String(err)}`,
    );
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { productId, quantity } = req.body;
    const result = await EcommerceService.addToCart(
      userId,
      productId,
      quantity,
    );

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to add item to cart",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Item added to cart",
      http.CREATED,
    );
  } catch (err: unknown) {
    logger.error(
      `Error adding to cart: ${err instanceof Error ? err.message : String(err)}`,
    );
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const productId = parseInt(req.params.productId as string, 10);
    const { quantity } = req.body;
    const result = await EcommerceService.updateCartItem(
      userId,
      productId,
      quantity,
    );

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to update cart item",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Cart item updated",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(
      `Error updating cart item: ${err instanceof Error ? err.message : String(err)}`,
    );
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const checkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { shippingAddress } = req.body;
    const result = await EcommerceService.checkout(userId, shippingAddress);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Checkout failed",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Checkout successful",
      http.CREATED,
    );
  } catch (err: unknown) {
    logger.error(
      `Error during checkout: ${err instanceof Error ? err.message : String(err)}`,
    );
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const orderId = parseInt(req.params.id as string, 10);
    const { status } = req.body;
    const result = await EcommerceService.updateOrderStatus(
      orderId,
      status as OrderStatus,
    );

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to update order status",
        httpError.BAD_REQUEST,
      );
    }
    return wrapper.response(
      res,
      "success",
      result,
      "Order status updated",
      http.OK,
    );
  } catch (err: unknown) {
    logger.error(
      `Error updating order status: ${err instanceof Error ? err.message : String(err)}`,
    );
    return wrapper.response(
      res,
      "fail",
      wrapper.error(err instanceof Error ? err : new Error(String(err))),
      "Internal Server Error",
      httpError.INTERNAL_ERROR,
    );
  }
};
