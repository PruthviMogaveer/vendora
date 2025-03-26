import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { getFeaturedProducts, getNewArrivals, getPopularProducts } from '@/services/productService';
import { ProductFeaturedSection } from '@/components/ProductFeaturedSection';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Package, Heart, Clock, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';

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

  // Fetch categories from backend
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setTimeout(() => setSelectedProduct(null), 300); // Clear after animation
  };
  
  // Fallback to default categories if API call fails
  const categoryGroups = categories.length > 0 ? categories : [
    { id: "1", name: 'Electronics', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', slug: 'electronics' },
    { id: "2", name: 'Clothing', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', slug: 'clothing' },
    { id: "3", name: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', slug: 'home' },
    { id: "4", name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', slug: 'beauty' },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      
      {/* Categories Section */}
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
      
      {/* Featured Products Section */}
      <ProductFeaturedSection
        title="Featured Collection"
        description="Discover our carefully curated selection of premium products, designed with attention to every detail."
        products={featuredProducts}
        isLoading={isFeaturedLoading}
      />
      
      {/* New Arrivals Section */}
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
            {isNewArrivalsLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-xl mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              ))
            ) : (
              newArrivals.slice(0, 4).map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard 
                    product={product} 
                    featured={true}
                    onQuickView={() => handleQuickView(product)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* App Features */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-slide-up">
            <h2 className="text-3xl font-medium tracking-tight mb-4">
              Why Shop With Us
            </h2>
            <p className="text-primary/80">
              Discover the benefits of shopping on our platform
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShoppingBag, title: "Fast Shipping", description: "Free delivery on orders over $50" },
              { icon: Package, title: "Easy Returns", description: "30-day money back guarantee" },
              { icon: TrendingUp, title: "Latest Trends", description: "Updated collections every week" },
              { icon: Heart, title: "Wishlist", description: "Save your favorite items" }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="p-6 rounded-xl border border-border bg-background hover:shadow-md transition-all duration-300 text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-primary/5 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-medium text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Products */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div className="text-left mb-6 md:mb-0">
              <h2 className="text-3xl font-medium tracking-tight mb-2">
                <span className="flex items-center gap-2">
                  <TrendingUp size={24} className="text-primary" /> Popular Right Now
                </span>
              </h2>
              <p className="text-primary/70">Top trending products based on sales</p>
            </div>
            <Link to="/products?sort=trending">
              <Button variant="outline" className="group">
                View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isPopularLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-xl mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              ))
            ) : (
              popularProducts.slice(0, 4).map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard 
                    product={product} 
                    featured={true}
                    onQuickView={() => handleQuickView(product)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <h2 className="text-3xl font-medium tracking-tight mb-4">
              Stay Updated
            </h2>
            <p className="text-primary/80 mb-8">
              Subscribe to receive updates on new products, exclusive offers, and inspiration.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
              <button
                type="submit"
                className="btn-hover inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-primary/60 mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>
      </section>
      
      {/* Quick View Modal */}
      <QuickViewModal 
        isOpen={isQuickViewOpen} 
        onClose={closeQuickView} 
        product={selectedProduct} 
      />
      
      <Footer />
    </div>
  );
};

export default Index;
