import prisma from "@/helpers/db/prisma/client";

export default class PharmacyRepository {
  static async createCategory(payload: { name: string; description?: string }) {
    return prisma.category.create({
      data: payload,
    });
  }

  static async getProductsByCategory(categoryId: number) {
    return prisma.product.findMany({
      where: { categoryId },
    });
  }

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

  static async updateStock(productId: number, quantity: number) {
    return prisma.product.update({
      where: { id: productId },
      data: { stock: quantity },
    });
  }

  static async updatePrice(productId: number, newPrice: number) {
    return prisma.product.update({
      where: { id: productId },
      data: { price: newPrice },
    });
  }

  static async getProductById(productId: number) {
    return prisma.product.findUnique({
      where: { id: productId },
    });
  }
}
