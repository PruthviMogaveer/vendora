import React from 'react';
import { useAppSelector } from '@/hooks';
import { useProductFilters } from '@/hooks/useProductFilters';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PriceRangeFilterProps {
  setCurrentPage: (page: number) => void;
}

// Price ranges for the filter
const priceRanges = [
  { label: '$0 - $100', min: 0, max: 100 },
  { label: '$100 - $500', min: 100, max: 500 },
  { label: '$500 - $1000', min: 500, max: 1000 },
  { label: '$1000+', min: 1000, max: 100000 },
];

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ setCurrentPage }) => {
  const { priceRange, minPrice, maxPrice } = useAppSelector(state => state.products);
  const { handlePriceRangeChange, handlePriceRangeCommit } = useProductFilters({ setCurrentPage });

  // Check if a price range is active
  const isPriceRangeActive = (min: number, max: number): boolean => {
    return priceRange[0] === min && priceRange[1] === max;
  };

  // Handle price range checkbox selection
  const handlePriceRangeSelect = (min: number, max: number) => {
    // If this range is already active, deselect it and reset to full range
    if (isPriceRangeActive(min, max)) {
      handlePriceRangeChange([minPrice, maxPrice]);
    } else {
      // Otherwise select this range
      handlePriceRangeChange([min, max]);
    }
    
    // Apply the filter
    handlePriceRangeCommit();
  };
  
  return (
    <div>
      <h4 className="font-medium mb-3">Price Range</h4>
      <div className="space-y-2">
        {priceRanges.map((range) => (
          <div key={range.label} className="flex items-center space-x-2">
            <Checkbox 
              id={`price-range-${range.min}-${range.max}`} 
              checked={isPriceRangeActive(range.min, range.max)}
              onCheckedChange={() => handlePriceRangeSelect(range.min, range.max)}
            />
            <Label 
              htmlFor={`price-range-${range.min}-${range.max}`}
              className="cursor-pointer text-sm"
            >
              {range.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
