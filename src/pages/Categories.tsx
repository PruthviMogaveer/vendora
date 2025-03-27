
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCategories } from '@/hooks/useCategories';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Category } from '@/services/categoryService';

const Categories = () => {
  const { data: categories = [], isLoading, error } = useCategories();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">
              Shop by Category
            </h1>
            <p className="text-primary/80 max-w-2xl mx-auto">
              Browse our collections organized by category to find exactly what you're looking for
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <Skeleton className="aspect-square mb-2 rounded-xl" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category: Category, index) => (
                <Link 
                  key={category.id}
                  to={`/products?category=${category.slug}`}
                  className="group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative rounded-xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-lg">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-medium text-lg">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Categories;
