
import React from 'react';
import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';

interface FeaturedProductsProps {
  title: string;
  description?: string;
  products: Product[];
  viewAllLink?: string;
}

export const FeaturedProducts = ({
  title,
  description,
  products,
  viewAllLink = '/products',
}: FeaturedProductsProps) => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-medium tracking-tight mb-3 animate-slide-up">
              {title}
            </h2>
            {description && (
              <p className="text-primary/80 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {description}
              </p>
            )}
          </div>
          
          {viewAllLink && (
            <Link 
              to={viewAllLink}
              className="inline-flex items-center text-sm font-medium hover:text-primary/70 mt-4 md:mt-0 animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${0.1 * (index % 4)}s` }}
            >
              <ProductCard product={product} featured={true} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
