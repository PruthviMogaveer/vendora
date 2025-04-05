
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProductFilters } from '@/hooks/useProductFilters';

interface ProductSearchProps {
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

export const ProductSearch = ({
  isSearching,
  setIsSearching,
}: ProductSearchProps) => {
  const { 
    searchQuery, 
    handleSearchChange, 
    handleSearchSubmit 
  } = useProductFilters();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    handleSearchSubmit();
    setIsSearching(false);
  };

  return (
    <form onSubmit={handleFormSubmit} className="relative">
      <Input
        type="search"
        placeholder="Search products..."
        className="pl-10 pr-4 py-2"
        value={searchQuery}
        onChange={handleInputChange}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Button 
        type="submit" 
        variant="default" 
        size="sm" 
        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7"
        disabled={isSearching}
      >
        {isSearching ? 'Searching...' : 'Search'}
      </Button>
    </form>
  );
};
