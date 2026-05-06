import prisma from "@/helpers/db/prisma/client";
import { GetAllProductsFilters } from "@/interfaces/pharmacy-interface";

export default class PharmacyRepository {
  static async getAllProducts(filters?: GetAllProductsFilters) {
    const whereClause: any = {};

    if (filters?.categoryId) {
      whereClause.categoryId = filters.categoryId;
    }

    if (filters?.categoryName) {
      whereClause.category = {
        name: { contains: filters.categoryName, mode: "insensitive" },
      };
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      whereClause.price = {};
      if (filters?.minPrice !== undefined)
        whereClause.price.gte = filters.minPrice;
      if (filters?.maxPrice !== undefined)
        whereClause.price.lte = filters.maxPrice;
    }

    if (filters?.search) {
      whereClause.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const orderByClause: any = {};
    if (filters?.sortBy) {
      orderByClause[filters.sortBy] = filters.sortOrder || "asc";
    } else {
      orderByClause.createdAt = "desc";
    }

    const page = Math.max(1, filters?.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters?.limit ?? 12));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy: orderByClause,
        skip,
        take: limit,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    return { items, total };
  }

  static async getAllCategories() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }

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
