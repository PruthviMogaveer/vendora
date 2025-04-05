
import React from 'react';
import { ProductFilters } from '@/components/ProductFilters';
import { ProductGrid } from '@/components/ProductGrid';
import { useAppSelector } from '@/hooks';

interface ProductsContentProps {
  showFilters: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
}

export const ProductsContent: React.FC<ProductsContentProps> = ({ 
  showFilters,
  currentPage,
  setCurrentPage,
  itemsPerPage
}) => {
  const { filteredProducts, loading } = useAppSelector(state => state.products);

  // Paginate filtered products
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Filters - Desktop (side) and Mobile (top) */}
      <div 
        className={`${
          showFilters ? 'block' : 'hidden md:block'
        } w-full md:w-64 flex-shrink-0 animate-slide-up`}
      >
        <ProductFilters 
          setCurrentPage={setCurrentPage}
        />
      </div>
      
      {/* Products Grid */}
      <div className="flex-1 animate-slide-up">
        <ProductGrid 
          currentProducts={currentProducts}
          isLoading={loading}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};
