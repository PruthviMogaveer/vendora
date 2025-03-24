
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Separator } from '@/components/ui/separator';
import { products } from '@/data/products';
import { Filter, SlidersHorizontal, X } from 'lucide-react';

const Products = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const categories = [...new Set(products.map(product => product.category))];
  
  const filteredProducts = activeCategory
    ? products.filter(product => product.category === activeCategory)
    : products;
    
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">
              Our Collection
            </h1>
            <p className="text-primary/80 max-w-2xl mx-auto">
              Explore our curated selection of premium products, designed with attention to every detail and crafted with the finest materials.
            </p>
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
              <div className="sticky top-24 bg-white rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-medium">Filters</h2>
                  <Filter size={16} />
                </div>
                
                <Separator className="mb-4" />
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveCategory(null)}
                      className={`text-sm w-full text-left px-2 py-1.5 rounded transition-colors ${
                        activeCategory === null
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      All Products
                    </button>
                    
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`text-sm w-full text-left px-2 py-1.5 rounded capitalize transition-colors ${
                          activeCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-secondary'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                <Separator className="mb-4" />
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Price Range</h3>
                  {/* Price slider would go here */}
                  <div className="h-10 bg-secondary/50 rounded flex items-center justify-center">
                    <span className="text-xs text-primary/60">Price filter (coming soon)</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setActiveCategory(null);
                    setShowFilters(false);
                  }}
                  className="text-sm w-full px-4 py-2 border border-input rounded-md hover:bg-secondary transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="flex-1 animate-slide-up">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="animate-slide-up"
                    style={{ animationDelay: `${0.05 * (index % 6)}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-primary/70">No products found in this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Products;
