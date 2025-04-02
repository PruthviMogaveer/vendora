
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setShowOnSale, setMinDiscountPercentage, fetchProducts } from '@/store/slices/productsSlice';

interface OnSaleFilterProps {
  setCurrentPage: (page: number) => void;
}

export const OnSaleFilter: React.FC<OnSaleFilterProps> = ({ setCurrentPage }) => {
  const { 
    showOnSale, 
    minDiscountPercentage, 
    activeCategory, 
    searchQuery, 
    priceRange 
  } = useAppSelector(state => state.products);
  
  const dispatch = useAppDispatch();

  const handleSaleToggle = (checked: boolean) => {
    dispatch(setShowOnSale(checked));
    setCurrentPage(1);
    
    // Fetch products with updated sale filter
    dispatch(fetchProducts({
      category: activeCategory || undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale: checked,
      minDiscountPercentage: checked ? minDiscountPercentage : undefined
    }));
  };
  
  const handleDiscountChange = (value: number[]) => {
    dispatch(setMinDiscountPercentage(value[0]));
    setCurrentPage(1);
    
    // Fetch products with updated discount percentage
    dispatch(fetchProducts({
      category: activeCategory || undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale: true,
      minDiscountPercentage: value[0]
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="font-medium">On Sale</h4>
          <p className="text-xs text-muted-foreground">
            Show discounted items only
          </p>
        </div>
        <Switch
          checked={showOnSale}
          onCheckedChange={handleSaleToggle}
        />
      </div>
      
      {showOnSale && (
        <div className="mt-4">
          <div className="flex justify-between mb-2">
            <Label>Minimum Discount</Label>
            <span className="text-sm text-muted-foreground">
              {minDiscountPercentage}%
            </span>
          </div>
          <Slider
            defaultValue={[0]}
            min={0}
            max={75}
            step={5}
            value={[minDiscountPercentage]}
            onValueChange={handleDiscountChange}
            className="mb-2"
          />
        </div>
      )}
    </div>
  );
};
