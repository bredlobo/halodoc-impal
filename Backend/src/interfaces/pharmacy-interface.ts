import PharmacyRepository from "@/modules/Pharmacy/repositories/pharmacy-repositories";

export interface GetAllProductsFilters {
  categoryId?: number;
  categoryName?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "price" | "name" | "createdAt" | "stock";
  sortOrder?: "asc" | "desc";
}

export type CreatedCategory = Awaited<
  ReturnType<typeof PharmacyRepository.createCategory>
>;

export type ProductList = Awaited<
  ReturnType<typeof PharmacyRepository.getProductsByCategory>
>;

export type AllProducts = Awaited<
  ReturnType<typeof PharmacyRepository.getAllProducts>
>;

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
