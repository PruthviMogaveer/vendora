
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SlidersHorizontal, X, BadgePercent, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProductFilters } from '@/components/ProductFilters';
import { ProductSearch } from '@/components/ProductSearch';
import { ProductGrid } from '@/components/ProductGrid';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchProducts, setActiveCategories } from '@/store/slices/productsSlice';
import { Badge } from '@/components/ui/badge';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getCategoryBySlug } from '@/services/categoryService';

const Products = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({});
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
    activeCategories 
  } = useAppSelector(state => state.products);

  // Get categories from URL query parameters
  useEffect(() => {
    const categoryParams = searchParams.getAll('category');
    const hasParamsChanged = !categoryParams.every(cat => activeCategories.includes(cat)) || 
                            !activeCategories.every(cat => categoryParams.includes(cat));
    
    if (categoryParams.length > 0 && hasParamsChanged) {
      // Set active categories in Redux store
      dispatch(setActiveCategories(categoryParams));
      
      // Fetch products filtered by these categories
      dispatch(fetchProducts({ 
        categories: categoryParams,
        showOnSale,
        minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined
      }));
      
      // Get the readable category names for display
      const fetchCategoryNames = async () => {
        const names: Record<string, string> = {};
        
        for (const categorySlug of categoryParams) {
          try {
            const category = await getCategoryBySlug(categorySlug);
            if (category) {
              names[categorySlug] = category.name;
            } else {
              // If we can't find the category, at least capitalize the slug
              names[categorySlug] = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
            }
          } catch (error) {
            console.error('Error fetching category name:', error);
            // Fallback to capitalized slug
            names[categorySlug] = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
          }
        }
        
        setCategoryNames(names);
      };
      
      fetchCategoryNames();
      console.log('Filtering products by categories:', categoryParams);
    } else if (categoryParams.length === 0 && activeCategories.length > 0) {
      // If no category parameters but some are active, clear active categories
      dispatch(setActiveCategories([]));
      dispatch(fetchProducts({}));
      setCategoryNames({});
    } else if (categoryParams.length === 0 && activeCategories.length === 0) {
      // If no category parameters and none are active, fetch all products
      dispatch(fetchProducts({}));
      setCategoryNames({});
    }
  }, [dispatch, searchParams, activeCategories.length, showOnSale, minDiscountPercentage]);

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
              {activeCategories.length === 1 
                ? `${categoryNames[activeCategories[0]] || 'Selected'} Products`
                : activeCategories.length > 1
                  ? 'Multi-Category Selection'
                  : 'Our Collection'}
            </h1>
            <p className="text-primary/80 max-w-2xl mx-auto">
              {activeCategories.length === 1
                ? `Browse our selection of ${(categoryNames[activeCategories[0]] || activeCategories[0]).toLowerCase()} products, designed with quality and value in mind.`
                : activeCategories.length > 1
                  ? `Browsing products across multiple categories: ${activeCategories.map(cat => categoryNames[cat] || cat).join(', ')}.`
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
          <div className="flex flex-wrap justify-center mb-6 animate-slide-up gap-2">
            {activeCategories.length > 0 && activeCategories.map(category => (
              <Badge key={category} variant="outline" className="flex items-center gap-1 px-3 py-1">
                <Tag size={14} className="mr-1" />
                {categoryNames[category] || (category.charAt(0).toUpperCase() + category.slice(1))}
              </Badge>
            ))}
            
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
