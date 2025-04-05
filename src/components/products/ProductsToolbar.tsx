
import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { ProductSearch } from '@/components/ProductSearch';
import { ProductSorting } from '@/components/filters/ProductSorting';

interface ProductsToolbarProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

export const ProductsToolbar: React.FC<ProductsToolbarProps> = ({ 
  showFilters,
  setShowFilters,
  isSearching,
  setIsSearching
}) => {
  return (
    <React.Fragment>
      {/* Search and Sort Row */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 animate-slide-up gap-4">
        {/* Search bar */}
        <div className="w-full md:w-80">
          <ProductSearch 
            isSearching={isSearching}
            setIsSearching={setIsSearching}
          />
        </div>
        
        {/* Sorting dropdown */}
        <ProductSorting />
      </div>
      
      {/* Mobile filter button */}
      <div className="md:hidden mb-6 animate-slide-up">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md border border-input"
        >
          {showFilters ? <X size={16} /> : <SlidersHorizontal size={16} />}
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
    </React.Fragment>
  );
};
