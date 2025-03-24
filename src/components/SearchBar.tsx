
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/productService';
import { Product } from '@/types/product';
import { Search, Loader2 } from 'lucide-react';

export const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['search-products'],
    queryFn: () => getProducts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (product: Product) => {
    setOpen(false);
    navigate(`/products/${product.id}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 hover:bg-secondary rounded-full transition-colors flex items-center gap-1"
      >
        <Search size={20} className="text-primary" />
        <span className="hidden md:inline text-sm">Search (⌘K)</span>
      </button>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search products..." />
        <CommandList>
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <CommandEmpty>No products found.</CommandEmpty>
              <CommandGroup heading="Products">
                {products.map((product) => (
                  <CommandItem
                    key={product.id}
                    onSelect={() => handleSelect(product)}
                    className="flex items-center gap-2"
                  >
                    <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
