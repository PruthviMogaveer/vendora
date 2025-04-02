
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SlidersHorizontal, X, BadgePercent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProductFilters } from '@/components/ProductFilters';
import { ProductSearch } from '@/components/ProductSearch';
import { ProductGrid } from '@/components/ProductGrid';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchProducts, setActiveCategory } from '@/store/slices/productsSlice';
import { Badge } from '@/components/ui/badge';
import { useLocation, useSearchParams } from 'react-router-dom';

const Products = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  const dispatch = useAppDispatch();
  const { 
    filteredProducts, 
    loading, 
    error, 
    showOnSale, 
    minDiscountPercentage,
    activeCategory 
  } = useAppSelector(state => state.products);

  // Get category from URL query parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categoryParam !== activeCategory) {
      // Set active category in Redux store
      dispatch(setActiveCategory(categoryParam));
      
      // Fetch products filtered by this category
      dispatch(fetchProducts({ 
        category: categoryParam,
        showOnSale,
        minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined
      }));
      
      console.log('Filtering products by category:', categoryParam);
    } else if (!categoryParam && !activeCategory) {
      // If no category parameter and none is active, fetch all products
      dispatch(fetchProducts({}));
    }
  }, [dispatch, searchParams, activeCategory, showOnSale, minDiscountPercentage]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading products",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  }, [error, toast]);
  
  // Paginate filtered products
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">
              {activeCategory 
                ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}` 
                : 'Our Collection'}
            </h1>
            <p className="text-primary/80 max-w-2xl mx-auto">
              {activeCategory
                ? `Browse our selection of ${activeCategory} products, designed with quality and value in mind.`
                : 'Explore our curated selection of premium products, designed with attention to every detail and crafted with the finest materials.'}
            </p>
          </div>
          
          {/* Search bar */}
          <div className="max-w-md mx-auto mb-8 animate-slide-up">
            <ProductSearch 
              isSearching={isSearching}
              setIsSearching={setIsSearching}
              setCurrentPage={setCurrentPage}
            />
          </div>
          
          {/* Active filters display */}
          <div className="flex justify-center mb-6 animate-slide-up gap-2">
            {activeCategory && (
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                Category: {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
              </Badge>
            )}
            
            {showOnSale && (
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                <BadgePercent size={14} />
                {minDiscountPercentage > 0 ? 
                  `Discount ${minDiscountPercentage}% or more` : 
                  'On Sale Items'}
              </Badge>
            )}
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
                setCurrentPage={setCurrentPage}
              />
            </div>
            
            {/* Products Grid */}
            <div className="flex-1 animate-slide-up">
              <ProductGrid 
                currentProducts={currentProducts}
                isLoading={loading}
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
