
import React, { useEffect } from 'react';
import { ProductFilters } from '@/components/ProductFilters';
import { ProductGrid } from '@/components/ProductGrid';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { fetchProducts } from '@/store/slices/productsSlice';

interface ProductsContentProps {
  showFilters: boolean;
  currentPage: number;
  updateCurrentPage: (page: number) => void;
  totalPages: number;
}

export const ProductsContent: React.FC<ProductsContentProps> = ({ 
  showFilters,
  currentPage,
  updateCurrentPage,
  totalPages
}) => {
  const { filteredProducts, loading, priceRange, activeCategories, showOnSale, minDiscountPercentage, pageSize } = useAppSelector(state => state.products);
  const dispatch = useAppDispatch();
  
  // Ensure filters are applied when component mounts
  useEffect(() => {
    dispatch(fetchProducts({
      categories: activeCategories.length > 0 ? activeCategories : undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale,
      minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined,
      page: currentPage,
      pageSize
    }));
  }, [dispatch]);
  
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Filters - Desktop (side) and Mobile (top) */}
      <div 
        className={`${
          showFilters ? 'block' : 'hidden md:block'
        } w-full md:w-64 flex-shrink-0 animate-slide-up`}
      >
        <ProductFilters setCurrentPage={updateCurrentPage} />
      </div>
      
      {/* Products Grid */}
      <div className="flex-1 animate-slide-up">
        <ProductGrid 
          currentProducts={filteredProducts}
          isLoading={loading}
          currentPage={currentPage}
          updateCurrentPage={updateCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};
