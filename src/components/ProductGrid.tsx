
import React from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types/product';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppSelector } from '@/hooks';
import { useProductFilters } from '@/hooks/useProductFilters';

interface ProductGridProps {
  currentProducts: Product[];
  isLoading: boolean;
  currentPage: number;
  updateCurrentPage: (page: number) => void;
  totalPages: number;
}

export const ProductGrid = ({
  currentProducts,
  isLoading,
  currentPage,
  updateCurrentPage,
  totalPages,
}: ProductGridProps) => {
  const { handlePageChange } = useProductFilters({ updateCurrentPage });

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

  // Function to render page numbers with ellipses for many pages
  const renderPageNumbers = () => {
    const pageItems = [];
    const maxVisiblePages = 5; // Maximum number of page links to show
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page
    if (startPage > 1) {
      pageItems.push(
        <PaginationItem key="page-1">
          <PaginationLink 
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Show ellipsis if there's a gap
      if (startPage > 2) {
        pageItems.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink 
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Last page
    if (endPage < totalPages) {
      // Show ellipsis if there's a gap
      if (endPage < totalPages - 1) {
        pageItems.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      pageItems.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink 
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pageItems;
  };

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
      
      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                </PaginationItem>
              )}
              
              {renderPageNumbers()}
              
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};
