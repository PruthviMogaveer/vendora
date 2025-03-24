
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-[#f5f5f7] -z-10" />
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 -z-10" />
      
      {/* Content container */}
      <div className="container mx-auto px-6 md:px-12 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6 animate-slide-up">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary/80 mb-2">
              New Collection
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight tracking-tight">
              Discover Our Premium Collection
            </h1>
            <p className="text-lg text-primary/80 max-w-xl">
              Experience elegance in every detail. Our carefully crafted products combine timeless design with exceptional quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/products" className="btn-hover inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/about" className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                Learn More
              </Link>
            </div>
          </div>
          
          {/* Hero image */}
          <div className="relative animate-fade-in">
            <div className="aspect-[4/3] lg:aspect-square relative overflow-hidden rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Premium product showcase"
                className="object-cover w-full h-full transform scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-black/0 to-black/0 rounded-2xl"></div>
            </div>
            
            {/* Floating card */}
            <div className="glass absolute -bottom-6 -left-6 p-6 rounded-xl shadow-sm max-w-xs animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-sm font-medium mb-1">Premium Quality</p>
              <p className="text-sm text-primary/80">Every product is crafted with precision and care for an exceptional experience.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
