import prisma from "@/helpers/db/prisma/client";
import { OrderStatus } from "@/generated/prisma";

export default class EcommerceRepository {
  static async createProduct(payload: {
    categoryId: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl?: string;
  }) {
    return prisma.product.create({
      data: payload,
    });
  }

  static async getProductById(productId: number) {
    return prisma.product.findUnique({
      where: { id: productId },
    });
  }

  static async updateProduct(
    productId: number,
    payload: {
      categoryId?: number;
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      imageUrl?: string;
    },
  ) {
    return prisma.product.update({
      where: { id: productId },
      data: payload,
    });
  }

  static async deleteProduct(productId: number) {
    return prisma.product.delete({
      where: { id: productId },
    });
  }

  static async getCartByUserId(userId: number) {
    return prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  static async createCart(userId: number) {
    return prisma.cart.create({ data: { userId } });
  }

  static async getCartItem(cartId: number, productId: number) {
    return prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
    });
  }

  static async addToCart(cartId: number, productId: number, quantity: number) {
    return prisma.cartItem.create({
      data: { cartId, productId, quantity },
    });
  }

  static async updateCartItemQuantity(cartItemId: number, quantity: number) {
    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  static async removeCartItem(cartItemId: number) {
    return prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  static async clearCart(cartId: number) {
    return prisma.cartItem.deleteMany({ where: { cartId } });
  }

  // Checkout using Transaction (Enforcing stock integrity)
  static async checkout(
    userId: number,
    shippingAddress: string,
    cartId: number,
    cartItems: any[],
    totalAmount: number,
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. Create Order
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          shippingAddress,
          status: "PENDING",
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });

      // 2. Reduce Stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 3. Clear Cart
      await tx.cartItem.deleteMany({ where: { cartId } });

      return order;
    });
  }

  static async updateOrderStatus(orderId: number, status: OrderStatus) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
