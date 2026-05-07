import * as wrapper from "@/helpers/utils/wrapper";
import { NotFoundError, BadRequestError } from "@/helpers/error";
import { ResponseResult } from "@/interfaces/wrapper-interface";
import PharmacyRepository from "@/modules/Pharmacy/repositories/pharmacy-repositories";
import {
  GetAllProductsFilters,
  AllCategories,
  CreatedCategory,
  ProductList,
  AllProducts,
  CreatedProduct,
  UpdatedStock,
  UpdatedPrice,
  AvailabilityCheck,
  ProductDetail,
} from "@/interfaces/pharmacy-interface";

export default class PharmacyService {
  static async getAllProducts(
    filters?: GetAllProductsFilters,
  ): Promise<ResponseResult<AllProducts>> {
    try {
      const page = Math.max(1, filters?.page ?? 1);
      const limit = Math.min(100, Math.max(1, filters?.limit ?? 12));
      const { items, total } = await PharmacyRepository.getAllProducts(filters);
      const totalPages = Math.ceil(total / limit);
      return wrapper.data({ items, total, page, limit, totalPages });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async getAllCategories(): Promise<ResponseResult<AllCategories>> {
    try {
      const categories = await PharmacyRepository.getAllCategories();
      return wrapper.data(categories);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async createCategory(payload: {
    name: string;
    description?: string;
  }): Promise<ResponseResult<CreatedCategory>> {
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
  ): Promise<ResponseResult<ProductList>> {
    try {
      const products =
        await PharmacyRepository.getProductsByCategory(categoryId);
      return wrapper.data(products);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async createProduct(payload: {
    categoryId: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl?: string;
  }): Promise<ResponseResult<CreatedProduct>> {
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
  ): Promise<ResponseResult<UpdatedStock>> {
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
  ): Promise<ResponseResult<UpdatedPrice>> {
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

  static async getProductById(
    productId: number,
  ): Promise<ResponseResult<ProductDetail>> {
    try {
      const product = await PharmacyRepository.getProductById(productId);
      if (!product)
        return wrapper.error(new NotFoundError("Product not found"));
      return wrapper.data(product);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async checkAvailability(
    productId: number,
    requiredQty: number,
  ): Promise<ResponseResult<AvailabilityCheck>> {
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
