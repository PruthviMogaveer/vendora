
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useAppSelector } from '@/hooks';
import { useProductFilters } from '@/hooks/useProductFilters';

interface OnSaleFilterProps {
  setCurrentPage: (page: number) => void;
}

export const OnSaleFilter: React.FC<OnSaleFilterProps> = ({ setCurrentPage }) => {
  const { showOnSale, minDiscountPercentage } = useAppSelector(state => state.products);
  const { handleSaleToggle, handleDiscountChange } = useProductFilters({ setCurrentPage });

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
