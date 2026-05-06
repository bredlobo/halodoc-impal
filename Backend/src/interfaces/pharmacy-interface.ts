import PharmacyRepository from "@/modules/Pharmacy/repositories/pharmacy-repositories";

export interface GetAllProductsFilters {
  categoryId?: number;
  categoryName?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "price" | "name" | "createdAt" | "stock";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export type AllCategories = Awaited<
  ReturnType<typeof PharmacyRepository.getAllCategories>
>;

export type CreatedCategory = Awaited<
  ReturnType<typeof PharmacyRepository.createCategory>
>;

export type ProductList = Awaited<
  ReturnType<typeof PharmacyRepository.getProductsByCategory>
>;

export interface PaginatedProducts {
  items: Awaited<ReturnType<typeof PharmacyRepository.getAllProducts>>["items"];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AllProducts = PaginatedProducts;

export type CreatedProduct = Awaited<
  ReturnType<typeof PharmacyRepository.createProduct>
>;

export type UpdatedStock = Awaited<
  ReturnType<typeof PharmacyRepository.updateStock>
>;

export type UpdatedPrice = Awaited<
  ReturnType<typeof PharmacyRepository.updatePrice>
>;

export type AvailabilityCheck = {
  isAvailable: boolean;
  currentStock: number;
};
