
import React, { useState } from 'react';
import { Filter, X, BadgePercent, Percent } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { 
  setActiveCategory, 
  clearFilters, 
  fetchProducts, 
  setPriceRange,
  setShowOnSale,
  setMinDiscountPercentage
} from '@/store/slices/productsSlice';
import { useCategories } from '@/hooks/useCategories';

interface ProductFiltersProps {
  setCurrentPage: (page: number) => void;
}

export const ProductFilters = ({
  setCurrentPage,
}: ProductFiltersProps) => {
  const dispatch = useAppDispatch();
  const { 
    activeCategory, 
    searchQuery, 
    priceRange, 
    minPrice, 
    maxPrice,
    showOnSale,
    minDiscountPercentage
  } = useAppSelector(state => state.products);
  const { data: categories = [] } = useCategories();
  
  const handleCategoryChange = (category: string | null) => {
    dispatch(setActiveCategory(category));
    setCurrentPage(1);
    dispatch(fetchProducts({ 
      searchQuery: searchQuery || undefined, 
      category: category || undefined 
    }));
  };

  const handlePriceRangeChange = (values: number[]) => {
    dispatch(setPriceRange([values[0], values[1]]));
    setCurrentPage(1);
  };

  const handleOnSaleChange = (checked: boolean) => {
    dispatch(setShowOnSale(checked));
    setCurrentPage(1);
  };

  const handleDiscountPercentageChange = (values: number[]) => {
    dispatch(setMinDiscountPercentage(values[0]));
    setCurrentPage(1);
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
      
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={[minPrice, maxPrice]}
            value={priceRange}
            min={minPrice}
            max={maxPrice}
            step={1}
            onValueChange={handlePriceRangeChange}
            className="mb-6"
          />
          <div className="flex justify-between text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
      
      <Separator className="mb-4" />
      
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Deals & Discounts</h3>
        
        <div className="flex items-center justify-between px-2 mb-4">
          <div className="flex items-center gap-2">
            <BadgePercent size={16} />
            <span className="text-sm">On Sale Items</span>
          </div>
          <Switch 
            checked={showOnSale} 
            onCheckedChange={handleOnSaleChange}
          />
        </div>
        
        {showOnSale && (
          <div className="px-2">
            <p className="text-sm mb-2">Minimum Discount</p>
            <Slider
              defaultValue={[0]}
              value={[minDiscountPercentage]}
              min={0}
              max={90}
              step={5}
              onValueChange={handleDiscountPercentageChange}
              className="mb-2"
            />
            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                <Percent size={14} className="mr-1" /> {minDiscountPercentage}
              </span>
              <span>90%</span>
            </div>
          </div>
        )}
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
