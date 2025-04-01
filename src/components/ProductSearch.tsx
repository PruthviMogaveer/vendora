
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setSearchQuery, fetchProducts } from '@/store/slices/productsSlice';

interface ProductSearchProps {
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  setCurrentPage: (page: number) => void;
}

export const ProductSearch = ({
  isSearching,
  setIsSearching,
  setCurrentPage,
}: ProductSearchProps) => {
  const dispatch = useAppDispatch();
  const { 
    searchQuery, 
    activeCategory, 
    priceRange, 
    showOnSale, 
    minDiscountPercentage 
  } = useAppSelector(state => state.products);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1);
    
    dispatch(fetchProducts({
      searchQuery: searchQuery || undefined,
      category: activeCategory || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale: showOnSale,
      minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined
    })).finally(() => {
      setIsSearching(false);
    });
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Input
        type="search"
        placeholder="Search products..."
        className="pl-10 pr-4 py-2"
        value={searchQuery}
        onChange={handleSearchChange}
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
