/**
 * GraphQL Client Infrastructure
 * 
 * Central export point for all GraphQL related functionality
 */

// Client exports
export { graphqlClient, getGraphQLClient, clientGraphQLClient } from './client';

// Query functions
export { 
  getProducts, 
  getProductBySlug,
  getProductBySlugLight,
  getProductDetailsDeferred,
  getProductVariations,
  getProductRelated,
  getProductCategories,
  getProductCategory,
  getProductsByCategory 
} from './queries';
export { normalizeProductQueryResponse } from './queries';

// Type guards and utilities
export {
  isSimpleProduct,
  isVariableProduct,
  isExternalProduct,
  isGroupProduct,
  getProductPrice,
  getProductStockStatus,
  isProductOnSale,
} from './types';

// Transforms
export { transformProductForClient } from './transforms';

// Type exports
export type {
  SimpleProduct,
  VariableProduct,
  ExternalProduct,
  GroupProduct,
  Product,
} from './types';

// Generated types (re-export commonly used ones)
export type {
  GetProductsQuery,
  GetProductsQueryVariables,
  GetProductBySlugQuery,
  GetProductBySlugQueryVariables,
  GetProductBySlugLightQuery,
  GetProductBySlugLightQueryVariables,
  GetProductDetailsDeferredQuery,
  GetProductDetailsDeferredQueryVariables,
  GetProductVariationsQuery,
  GetProductVariationsQueryVariables,
  GetProductRelatedQuery,
  GetProductRelatedQueryVariables,
  GetProductCategoriesQuery,
  GetProductCategoriesQueryVariables,
  GetProductCategoryQuery,
  GetProductCategoryQueryVariables,
  GetProductsByCategoryQuery,
  GetProductsByCategoryQueryVariables,
} from './generated';
