
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types/product';

interface NewArrivalsSectionProps {
  products: Product[];
  isLoading: boolean;
  onQuickView: (product: Product) => void;
}

export const NewArrivalsSection = ({ 
  products, 
  isLoading, 
  onQuickView 
}: NewArrivalsSectionProps) => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/30">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="text-left mb-6 md:mb-0">
            <h2 className="text-3xl font-medium tracking-tight mb-2">New Arrivals</h2>
            <p className="text-primary/70">The latest additions to our collection</p>
          </div>
          <Link to="/products?sort=newest">
            <Button variant="outline" className="group">
              View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-xl mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </div>
            ))
          ) : (
            products.slice(0, 4).map((product, index) => (
              <div 
                key={product.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard 
                  product={product} 
                  featured={true}
                  onQuickView={() => onQuickView(product)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
