
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SlidersHorizontal, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getProducts } from '@/services/productService';
import { ProductFilters } from '@/components/ProductFilters';
import { ProductSearch } from '@/components/ProductSearch';
import { ProductGrid } from '@/components/ProductGrid';

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
            <ProductSearch 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              isSearching={isSearching}
            />
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
              <ProductFilters 
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                handleClearFilters={handleClearFilters}
                refetch={refetch}
                setCurrentPage={setCurrentPage}
              />
            </div>
            
            {/* Products Grid */}
            <div className="flex-1 animate-slide-up">
              <ProductGrid 
                products={products}
                currentProducts={currentProducts}
                isLoading={isLoading}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Products;
