
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useAppSelector } from '@/hooks';
import { useProductFilters } from '@/hooks/useProductFilters';

interface FilterHeaderProps {
  setCurrentPage: (page: number) => void;
}

export const FilterHeader: React.FC<FilterHeaderProps> = ({ setCurrentPage }) => {
  const { hasActiveFilters, handleClearFilters } = useProductFilters({ setCurrentPage });

  return (
    <div className="p-4 flex flex-row items-center justify-between">
      <h3 className="font-medium text-lg">Filters</h3>
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-xs"
          onClick={handleClearFilters}
        >
          <X className="h-3 w-3 mr-1" />
          Clear All
        </Button>
      )}
    </div>
  );
};
