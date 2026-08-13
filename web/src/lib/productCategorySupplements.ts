export interface ProductCategorySupplement {
  sourceCategorySlug: string;
  productSlugs: readonly string[];
}

const PRODUCT_CATEGORY_SUPPLEMENTS: Record<string, ProductCategorySupplement> = {
  'temp-wall-plates': {
    sourceCategorySlug: 'temp-room',
    productSlugs: [
      'wall-plate-temperature-sensor-with-optional-override-pushbutton',
      'wall-plate-temperature-sensor-with-rotary-setpoint-2',
    ],
  },
};

/** Returns legacy product assignments that supplement a product category. */
export function getProductCategorySupplement(
  categorySlug: string
): ProductCategorySupplement | undefined {
  return PRODUCT_CATEGORY_SUPPLEMENTS[categorySlug];
}