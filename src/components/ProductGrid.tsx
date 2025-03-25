
import React from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types/product';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppSelector } from '@/hooks';

interface ProductGridProps {
  currentProducts: Product[];
  isLoading: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  itemsPerPage: number;
}

export const ProductGrid = ({
  currentProducts,
  isLoading,
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
}: ProductGridProps) => {
  const { products } = useAppSelector(state => state.products);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse">
            <Skeleton className="aspect-square mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (currentProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-primary/70">No products found. Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProducts.map((product: Product, index: number) => (
          <div 
            key={product.id} 
            className="animate-slide-up"
            style={{ animationDelay: `${0.05 * (index % 6)}s` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {products.length > itemsPerPage && (
        <div className="mt-12">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} />
                </PaginationItem>
              )}
              
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink 
                      isActive={currentPage === pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};
