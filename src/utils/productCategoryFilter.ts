import type { Product } from "../types/product";

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

export function filterProductsByCategory(
  products: Product[],
  selectedCategory: string | null,
): Product[] {
  if (!selectedCategory) {
    return products;
  }

  const normalizedCategory = normalizeText(selectedCategory);

  return products.filter((product) =>
    product.categorias.some(
      (category) => normalizeText(category.nombre) === normalizedCategory,
    ),
  );
}