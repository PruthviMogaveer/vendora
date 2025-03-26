
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { getFeaturedProducts, getNewArrivals, getPopularProducts } from '@/services/productService';
import { ProductFeaturedSection } from '@/components/ProductFeaturedSection';
import { Product } from '@/types/product';
import { QuickViewModal } from '@/components/QuickViewModal';
import { CategorySection } from '@/components/home/CategorySection';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { PopularProductsSection } from '@/components/home/PopularProductsSection';
import { FeatureSection } from '@/components/home/FeatureSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { HomeLayout } from '@/components/home/HomeLayout';

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Fetch data from backend
  const { data: featuredProducts = [], isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: getFeaturedProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const { data: newArrivals = [], isLoading: isNewArrivalsLoading } = useQuery({
    queryKey: ['newArrivals'],
    queryFn: getNewArrivals,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const { data: popularProducts = [], isLoading: isPopularLoading } = useQuery({
    queryKey: ['popularProducts'],
    queryFn: getPopularProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setTimeout(() => setSelectedProduct(null), 300); // Clear after animation
  };
  
  return (
    <HomeLayout>
      <Hero />
      
      {/* Categories Section */}
      <CategorySection />
      
      {/* Featured Products Section */}
      <ProductFeaturedSection
        title="Featured Collection"
        description="Discover our carefully curated selection of premium products, designed with attention to every detail."
        products={featuredProducts}
        isLoading={isFeaturedLoading}
      />
      
      {/* New Arrivals Section */}
      <NewArrivalsSection 
        products={newArrivals} 
        isLoading={isNewArrivalsLoading}
        onQuickView={handleQuickView}
      />
      
      {/* App Features */}
      <FeatureSection />
      
      {/* Popular Products */}
      <PopularProductsSection 
        products={popularProducts} 
        isLoading={isPopularLoading}
        onQuickView={handleQuickView}
      />
      
      {/* Newsletter Section */}
      <NewsletterSection />
      
      {/* Quick View Modal */}
      <QuickViewModal 
        isOpen={isQuickViewOpen} 
        onClose={closeQuickView} 
        product={selectedProduct} 
      />
    </HomeLayout>
  );
};

export default Index;
