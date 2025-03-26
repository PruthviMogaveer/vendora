
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks';

export const CategorySection = () => {
  // Fetch categories from backend
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  
  // Fallback to default categories if API call fails
  const categoryGroups = categories.length > 0 ? categories : [
    { id: "1", name: 'Electronics', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', slug: 'electronics' },
    { id: "2", name: 'Clothing', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', slug: 'clothing' },
    { id: "3", name: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', slug: 'home' },
    { id: "4", name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', slug: 'beauty' },
  ];
  
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="text-left mb-6 md:mb-0">
            <h2 className="text-3xl font-medium tracking-tight mb-2">Shop by Category</h2>
            <p className="text-primary/70">Browse our most popular categories</p>
          </div>
          <Link to="/categories">
            <Button variant="outline" className="group">
              View All Categories <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {isCategoriesLoading ? (
            // Loading skeleton for categories
            [...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse rounded-xl overflow-hidden">
                <div className="aspect-square bg-muted"></div>
              </div>
            ))
          ) : (
            categoryGroups.slice(0, 4).map((category, index) => (
              <Link 
                key={category.id || index}
                to={`/products?category=${category.slug}`}
                className="relative rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-medium">{category.name}</h3>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
