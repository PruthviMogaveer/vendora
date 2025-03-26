
import React from 'react';
import { ShoppingBag, Package, TrendingUp, Heart } from 'lucide-react';

export const FeatureSection = () => {
  const features = [
    { icon: ShoppingBag, title: "Fast Shipping", description: "Free delivery on orders over $50" },
    { icon: Package, title: "Easy Returns", description: "30-day money back guarantee" },
    { icon: TrendingUp, title: "Latest Trends", description: "Updated collections every week" },
    { icon: Heart, title: "Wishlist", description: "Save your favorite items" }
  ];
  
  return (
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
          {features.map((feature, index) => (
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
  );
};
