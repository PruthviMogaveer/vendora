
import React from 'react';
import { Filter, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ProductFiltersProps {
  categories: string[];
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  handleClearFilters: () => void;
  refetch: () => void;
  setCurrentPage: (page: number) => void;
}

export const ProductFilters = ({
  categories,
  activeCategory,
  setActiveCategory,
  handleClearFilters,
  refetch,
  setCurrentPage,
}: ProductFiltersProps) => {
  return (
    <div className="sticky top-24 bg-white rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium">Filters</h2>
        <Filter size={16} />
      </div>
      
      <Separator className="mb-4" />
      
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => {
              setActiveCategory(null);
              setCurrentPage(1);
              refetch();
            }}
            className={`text-sm w-full text-left px-2 py-1.5 rounded transition-colors ${
              activeCategory === null
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-secondary'
            }`}
          >
            All Products
          </button>
          
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setCurrentPage(1);
                refetch();
              }}
              className={`text-sm w-full text-left px-2 py-1.5 rounded capitalize transition-colors ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <Separator className="mb-4" />
      
      <button
        onClick={handleClearFilters}
        className="text-sm w-full px-4 py-2 border border-input rounded-md hover:bg-secondary transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
};
