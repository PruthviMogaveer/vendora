
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FilterHeader } from '@/components/filters/FilterHeader';
import { CategoryFilter } from '@/components/filters/CategoryFilter';
import { PriceRangeFilter } from '@/components/filters/PriceRangeFilter';
import { OnSaleFilter } from '@/components/filters/OnSaleFilter';

interface ProductFiltersProps {
  setCurrentPage?: (page: number) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ setCurrentPage }) => {
  return (
    <Card className="sticky top-24">
      <CardHeader className="p-0">
        <FilterHeader setCurrentPage={setCurrentPage} />
      </CardHeader>
      
      <CardContent className="p-4 space-y-6">
        {/* Categories Accordion */}
        <CategoryFilter setCurrentPage={setCurrentPage} />
        
        <Separator />
        
        {/* Price Range */}
        <PriceRangeFilter setCurrentPage={setCurrentPage} />
        
        <Separator />
        
        {/* Sale Items */}
        <OnSaleFilter setCurrentPage={setCurrentPage} />
      </CardContent>
    </Card>
  );
};
