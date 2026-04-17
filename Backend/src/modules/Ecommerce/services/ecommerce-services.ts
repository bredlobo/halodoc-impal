import * as wrapper from "@/helpers/utils/wrapper";
import { NotFoundError, BadRequestError } from "@/helpers/error";
import { ResponseResult } from "@/interfaces/wrapper-interface";
import EcommerceRepository from "@/modules/Ecommerce/repositories/ecommerce-repositories";
import { OrderStatus } from "@/generated/prisma";
import PharmacyRepository from "@/modules/Pharmacy/repositories/pharmacy-repositories";

export default class EcommerceService {
  static async createProductByAdmin(payload: {
    categoryId: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl?: string;
  }): Promise<ResponseResult<any>> {
    try {
      const created = await EcommerceRepository.createProduct(payload);
      return wrapper.data(created);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async updateProductByAdmin(
    productId: number,
    payload: {
      categoryId?: number;
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      imageUrl?: string;
    },
  ): Promise<ResponseResult<any>> {
    try {
      const existingProduct =
        await EcommerceRepository.getProductById(productId);
      if (!existingProduct)
        return wrapper.error(new NotFoundError("Product not found"));

      const updated = await EcommerceRepository.updateProduct(
        productId,
        payload,
      );
      return wrapper.data(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async deleteProductByAdmin(
    productId: number,
  ): Promise<ResponseResult<any>> {
    try {
      const existingProduct =
        await EcommerceRepository.getProductById(productId);
      if (!existingProduct)
        return wrapper.error(new NotFoundError("Product not found"));

      await EcommerceRepository.deleteProduct(productId);
      return wrapper.data({ message: "Product deleted successfully" });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async getCart(userId: number): Promise<ResponseResult<any>> {
    try {
      let cart = await EcommerceRepository.getCartByUserId(userId);
      if (!cart) {
        cart = (await EcommerceRepository.createCart(userId)) as any;
        cart = await EcommerceRepository.getCartByUserId(userId);
      }

      let total = 0;
      cart?.items.forEach((item: any) => {
        total += item.quantity * item.product.price;
      });

      return wrapper.data({ ...cart, totalAmount: total });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async addToCart(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<ResponseResult<any>> {
    try {
      let cart = await EcommerceRepository.getCartByUserId(userId);
      if (!cart) {
        cart = (await EcommerceRepository.createCart(userId)) as any;
      }

      const product = await PharmacyRepository.getProductById(productId);
      if (!product)
        return wrapper.error(new NotFoundError("Product not found"));
      if (product.stock < quantity)
        return wrapper.error(new BadRequestError("Insufficient stock"));

      // Validating constraint to avoid duplicate item errors by incrementing instead
      const existingItem = await EcommerceRepository.getCartItem(
        cart!.id,
        productId,
      );
      if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        if (product.stock < newQty)
          return wrapper.error(
            new BadRequestError("Insufficient stock for cumulative quantity"),
          );
        const updated = await EcommerceRepository.updateCartItemQuantity(
          existingItem.id,
          newQty,
        );
        return wrapper.data(updated);
      }

      const added = await EcommerceRepository.addToCart(
        cart!.id,
        productId,
        quantity,
      );
      return wrapper.data(added);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async updateCartItem(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<ResponseResult<any>> {
    try {
      const cart = await EcommerceRepository.getCartByUserId(userId);
      if (!cart) return wrapper.error(new NotFoundError("Cart not found"));

      const existingItem = await EcommerceRepository.getCartItem(
        cart.id,
        productId,
      );
      if (!existingItem)
        return wrapper.error(new NotFoundError("Item not found in cart"));

      if (quantity <= 0) {
        await EcommerceRepository.removeCartItem(existingItem.id);
        return wrapper.data({ message: "Item removed from cart" });
      }

      const product = await PharmacyRepository.getProductById(productId);
      if (!product || product.stock < quantity)
        return wrapper.error(new BadRequestError("Insufficient stock"));

      const updated = await EcommerceRepository.updateCartItemQuantity(
        existingItem.id,
        quantity,
      );
      return wrapper.data(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async checkout(
    userId: number,
    shippingAddress: string,
  ): Promise<ResponseResult<any>> {
    try {
      const cart = await EcommerceRepository.getCartByUserId(userId);
      if (!cart || cart.items.length === 0)
        return wrapper.error(new BadRequestError("Cart is empty"));

      let totalAmount = 0;
      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          return wrapper.error(
            new BadRequestError(
              `Insufficient stock for product ${item.product.name}`,
            ),
          );
        }
        totalAmount += item.quantity * item.product.price;
      }

      // Executes checkout within Prisma Transaction mapping from repo
      const order = await EcommerceRepository.checkout(
        userId,
        shippingAddress,
        cart.id,
        cart.items,
        totalAmount,
      );
      return wrapper.data(order);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }

  static async updateOrderStatus(
    orderId: number,
    status: OrderStatus,
  ): Promise<ResponseResult<any>> {
    try {
      const updated = await EcommerceRepository.updateOrderStatus(
        orderId,
        status,
      );
      return wrapper.data(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return wrapper.error(new BadRequestError(message));
    }
  }
}
