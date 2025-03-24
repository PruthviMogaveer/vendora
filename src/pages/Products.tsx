
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Separator } from '@/components/ui/separator';
import { Filter, SlidersHorizontal, X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getProducts } from '@/services/productService';
import { Product } from '@/types/product';

const Products = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { toast } = useToast();
  
  // Fetch products from Supabase with backend filtering and search
  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['products', activeCategory, searchQuery],
    queryFn: () => getProducts(searchQuery, activeCategory || undefined),
  });

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error loading products",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Get unique categories from products for the filter
  const categories = [...new Set(products.map(product => product.category))];
  
  // Paginate products
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1);
    
    refetch().finally(() => {
      setIsSearching(false);
    });
  };

  // Reset filters
  const handleClearFilters = () => {
    setActiveCategory(null);
    setSearchQuery('');
    setShowFilters(false);
    setCurrentPage(1);
  };
    
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">
              Our Collection
            </h1>
            <p className="text-primary/80 max-w-2xl mx-auto">
              Explore our curated selection of premium products, designed with attention to every detail and crafted with the finest materials.
            </p>
          </div>
          
          {/* Search bar */}
          <div className="max-w-md mx-auto mb-8 animate-slide-up">
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
          </div>
          
          {/* Mobile filter button */}
          <div className="md:hidden mb-6 animate-slide-up">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md border border-input"
            >
              {showFilters ? <X size={16} /> : <SlidersHorizontal size={16} />}
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters - Desktop (side) and Mobile (top) */}
            <div 
              className={`${
                showFilters ? 'block' : 'hidden md:block'
              } w-full md:w-64 flex-shrink-0 animate-slide-up`}
            >
              <div className="sticky top-24 bg-white rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-medium">Filters</h2>
                  <Filter size={16} />
                </div>
                
                <Separator className="mb-4" />
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setActiveCategory(null);
                        setCurrentPage(1);
                        refetch();
                      }}
                      className={`text-sm w-full text-left px-2 py-1.5 rounded transition-colors ${
                        activeCategory === null
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      All Products
                    </button>
                    
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => {
                          setActiveCategory(category);
                          setCurrentPage(1);
                          refetch();
                        }}
                        className={`text-sm w-full text-left px-2 py-1.5 rounded capitalize transition-colors ${
                          activeCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-secondary'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                <Separator className="mb-4" />
                
                <button
                  onClick={handleClearFilters}
                  className="text-sm w-full px-4 py-2 border border-input rounded-md hover:bg-secondary transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="flex-1 animate-slide-up">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {currentProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentProducts.map((product: Product, index: number) => (
                        <div 
                          key={product.id} 
                          className="animate-slide-up"
                          style={{ animationDelay: `${0.05 * (index % 6)}s` }}
                        >
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-primary/70">No products found. Try adjusting your filters or search criteria.</p>
                    </div>
                  )}
                  
                  {/* Pagination */}
                  {products.length > itemsPerPage && (
                    <div className="mt-12">
                      <Pagination>
                        <PaginationContent>
                          {currentPage > 1 && (
                            <PaginationItem>
                              <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
                            </PaginationItem>
                          )}
                          
                          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                            const pageNumber = i + 1;
                            return (
                              <PaginationItem key={pageNumber}>
                                <PaginationLink 
                                  isActive={currentPage === pageNumber}
                                  onClick={() => setCurrentPage(pageNumber)}
                                >
                                  {pageNumber}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}
                          
                          {currentPage < totalPages && (
                            <PaginationItem>
                              <PaginationNext onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
                            </PaginationItem>
                          )}
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Products;
