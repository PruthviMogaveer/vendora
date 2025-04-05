
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAppSelector } from '@/hooks';
import { useProductFilters } from '@/hooks/useProductFilters';

interface PriceRangeFilterProps {
  setCurrentPage: (page: number) => void;
}

// Define price range options
const priceRanges = [
  { id: 'price-0-1000', label: '$0 - $1,000', min: 0, max: 1000 },
  { id: 'price-1000-5000', label: '$1,000 - $5,000', min: 1000, max: 5000 },
  { id: 'price-5000-10000', label: '$5,000 - $10,000', min: 5000, max: 10000 },
  { id: 'price-10000-plus', label: '$10,000+', min: 10000, max: 1000000 }
];

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ setCurrentPage }) => {
  const { priceRange, minPrice, maxPrice } = useAppSelector(state => state.products);
  const { handlePriceRangeSelect } = useProductFilters({ setCurrentPage });

  // Function to check if a price range is selected
  const isRangeSelected = (min: number, max: number) => {
    return priceRange[0] === min && priceRange[1] === max;
  };

  return (
    <div>
      <h4 className="font-medium mb-3">Price Range</h4>
      <div className="space-y-2">
        {priceRanges.map((range) => (
          <div key={range.id} className="flex items-center space-x-2">
            <Checkbox 
              id={range.id} 
              checked={isRangeSelected(range.min, range.max)}
              onCheckedChange={() => handlePriceRangeSelect(range.min, range.max)}
            />
            <Label 
              htmlFor={range.id}
              className="text-sm cursor-pointer"
            >
              {range.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
