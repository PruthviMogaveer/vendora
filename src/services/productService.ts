
// Re-export all product-related services from this file for backward compatibility
export * from './productQueryService';
// Don't re-export getProductById from productDetailService since it's already in productQueryService
export { createProduct, updateProduct, deleteProduct } from './productCrudService';
export * from './productVariantService';
