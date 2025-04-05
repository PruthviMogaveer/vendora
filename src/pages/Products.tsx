
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useProductsPage } from '@/hooks/useProductsPage';
import { ProductsHeader } from '@/components/products/ProductsHeader';
import { ProductsToolbar } from '@/components/products/ProductsToolbar';
import { ProductsContent } from '@/components/products/ProductsContent';

const Products = () => {
  const {
    showFilters,
    setShowFilters,
    isSearching,
    setIsSearching,
    currentPage,
    setCurrentPage,
    categoryNames,
    itemsPerPage
  } = useProductsPage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6 md:px-12">
          {/* Products Header with Title and Active Filters */}
          <ProductsHeader categoryNames={categoryNames} />
          
          {/* Search, Sort and Mobile Filter Controls */}
          <ProductsToolbar 
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            isSearching={isSearching}
            setIsSearching={setIsSearching}
            setCurrentPage={setCurrentPage}
          />
          
          {/* Products Content: Filters and Grid */}
          <ProductsContent 
            showFilters={showFilters}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Products;
