
import React from 'react';
import { Filter, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setActiveCategory, clearFilters, fetchProducts } from '@/store/slices/productsSlice';
import { useCategories } from '@/hooks/useCategories';

interface ProductFiltersProps {
  setCurrentPage: (page: number) => void;
}

export const ProductFilters = ({
  setCurrentPage,
}: ProductFiltersProps) => {
  const dispatch = useAppDispatch();
  const { activeCategory, searchQuery } = useAppSelector(state => state.products);
  const { data: categories = [] } = useCategories();
  
  const handleCategoryChange = (category: string | null) => {
    dispatch(setActiveCategory(category));
    setCurrentPage(1);
    dispatch(fetchProducts({ 
      searchQuery: searchQuery || undefined, 
      category: category || undefined 
    }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setCurrentPage(1);
    dispatch(fetchProducts({}));
  };

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
            onClick={() => handleCategoryChange(null)}
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
              key={category.id}
              onClick={() => handleCategoryChange(category.slug)}
              className={`text-sm w-full text-left px-2 py-1.5 rounded capitalize transition-colors ${
                activeCategory === category.slug
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
              }`}
            >
              {category.name}
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
