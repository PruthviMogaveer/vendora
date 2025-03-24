
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { getFeaturedProducts } from '@/services/productService';

const Index = () => {
  const { data: featuredProducts = [], isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: getFeaturedProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      
      <FeaturedProducts 
        title="Featured Collection"
        description="Discover our carefully curated selection of premium products, designed with attention to every detail."
        products={featuredProducts}
        isLoading={isLoading}
      />
      
      {/* Brand Promise Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
            <h2 className="text-3xl font-medium tracking-tight mb-4">
              Crafted with Purpose
            </h2>
            <p className="text-primary/80">
              Every product in our collection is designed with intention, blending form and function to enhance your everyday experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Exceptional Quality",
                description: "We source only the finest materials and partner with skilled artisans to create products that stand the test of time."
              },
              {
                title: "Thoughtful Design",
                description: "Every detail is considered, from the initial concept to the finishing touches, ensuring a seamless user experience."
              },
              {
                title: "Sustainable Practices",
                description: "We're committed to responsible manufacturing and packaging, minimizing our environmental impact at every step."
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="text-center p-8 glass rounded-xl animate-slide-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <h3 className="font-medium text-lg mb-3">{item.title}</h3>
                <p className="text-sm text-primary/70">{item.description}</p>
              </div>
            ))}
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
                className="btn-hover inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
      
      <Footer />
    </div>
  );
};

export default Index;
