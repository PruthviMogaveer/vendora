
import React, { useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types/product';
import { QuickViewModal } from '@/components/QuickViewModal';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductFeaturedSectionProps {
  title: string;
  description?: string;
  products: Product[];
  isLoading?: boolean;
}

export const ProductFeaturedSection = ({
  title,
  description,
  products,
  isLoading = false
}: ProductFeaturedSectionProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setTimeout(() => setSelectedProduct(null), 300); // Clear after animation
  };

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-slide-up">
          <h2 className="text-3xl font-medium tracking-tight mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-primary/80">
              {description}
            </p>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Skeleton className="aspect-square mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product, index) => (
              <div 
                key={product.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard 
                  product={product} 
                  featured={index < 4}
                  onQuickView={handleQuickView}
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Quick View Modal */}
        <QuickViewModal 
          isOpen={isQuickViewOpen} 
          onClose={closeQuickView} 
          product={selectedProduct} 
        />
      </div>
    </section>
  );
};
