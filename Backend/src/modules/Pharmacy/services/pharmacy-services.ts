import * as wrapper from "@/helpers/utils/wrapper";
import { NotFoundError, BadRequestError } from "@/helpers/error";
import { ResponseResult } from "@/interfaces/wrapper-interface";
import PharmacyRepository from "@/modules/Pharmacy/repositories/pharmacy-repositories";

export default class PharmacyService {
  static async createCategory(payload: any): Promise<ResponseResult<any>> {
    try {
      const category = await PharmacyRepository.createCategory(payload);
      return wrapper.data(category);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async getProductsByCategory(
    categoryId: number,
  ): Promise<ResponseResult<any>> {
    try {
      const products =
        await PharmacyRepository.getProductsByCategory(categoryId);
      return wrapper.data(products);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async createProduct(payload: any): Promise<ResponseResult<any>> {
    try {
      const product = await PharmacyRepository.createProduct(payload);
      return wrapper.data(product);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async updateStock(
    productId: number,
    quantity: number,
  ): Promise<ResponseResult<any>> {
    try {
      const product = await PharmacyRepository.getProductById(productId);
      if (!product)
        return wrapper.error(new NotFoundError("Product not found"));

      const updatedProduct = await PharmacyRepository.updateStock(
        productId,
        quantity,
      );
      return wrapper.data(updatedProduct);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async updatePrice(
    productId: number,
    newPrice: number,
  ): Promise<ResponseResult<any>> {
    try {
      const product = await PharmacyRepository.getProductById(productId);
      if (!product)
        return wrapper.error(new NotFoundError("Product not found"));

      const updatedProduct = await PharmacyRepository.updatePrice(
        productId,
        newPrice,
      );
      return wrapper.data(updatedProduct);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async checkAvailability(
    productId: number,
    requiredQty: number,
  ): Promise<ResponseResult<any>> {
    try {
      const product = await PharmacyRepository.getProductById(productId);
      if (!product)
        return wrapper.error(new NotFoundError("Product not found"));

      const isAvailable = product.stock >= requiredQty;
      return wrapper.data({ isAvailable, currentStock: product.stock });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }
}
