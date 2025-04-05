
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppSelector } from '@/hooks';
import { useProductFilters } from '@/hooks/useProductFilters';

interface ProductSortingProps {
  setCurrentPage: (page: number) => void;
}

export const ProductSorting: React.FC<ProductSortingProps> = ({ setCurrentPage }) => {
  const { sortBy, sortOrder } = useAppSelector(state => state.products);
  const { handleSortChange } = useProductFilters({ setCurrentPage });

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Sort by:</span>
      <Select
        value={`${sortBy}-${sortOrder}`}
        onValueChange={(value) => {
          const [sortBy, sortOrder] = value.split('-');
          handleSortChange(sortBy, sortOrder as 'asc' | 'desc');
        }}
      >
        <SelectTrigger className="w-[180px] h-9">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          <SelectItem value="price-asc">Price (Low to High)</SelectItem>
          <SelectItem value="price-desc">Price (High to Low)</SelectItem>
          <SelectItem value="newest-desc">Newest First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
