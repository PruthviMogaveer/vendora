
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProductSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  isSearching: boolean;
}

export const ProductSearch = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isSearching,
}: ProductSearchProps) => {
  return (
    <form onSubmit={handleSearch} className="relative">
      <Input
        type="search"
        placeholder="Search products..."
        className="pl-10 pr-4 py-2"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
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
