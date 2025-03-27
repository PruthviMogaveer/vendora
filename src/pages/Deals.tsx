
import React, { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { getDeals } from '@/services/productQueryService';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const Deals = () => {
  const { data: dealProducts = [], isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: getDeals,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Function to handle tab change and scroll to top
  const handleTabChange = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter products by deal type
  const flashDeals = dealProducts.filter(product => product.badge === 'flash');
  const clearanceDeals = dealProducts.filter(product => product.badge === 'clearance');
  const bundleDeals = dealProducts.filter(product => product.badge === 'bundle');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">
              Hot Deals
            </h1>
            <p className="text-primary/80 max-w-2xl mx-auto">
              Limited time offers on our best products. Don't miss out!
            </p>
          </div>
          
          <Tabs defaultValue="all" className="mb-12" onValueChange={handleTabChange}>
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="all">All Deals</TabsTrigger>
                <TabsTrigger value="flash">Flash Sales</TabsTrigger>
                <TabsTrigger value="clearance">Clearance</TabsTrigger>
                <TabsTrigger value="bundle">Bundle Offers</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="animate-fade-in">
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <Skeleton className="aspect-square mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {dealProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} featured={true} />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="flash" className="animate-fade-in">
              {flashDeals.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {flashDeals.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} featured={true} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No flash deals available at the moment. Check back later!</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="clearance" className="animate-fade-in">
              {clearanceDeals.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {clearanceDeals.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} featured={true} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No clearance items available at the moment. Check back later!</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="bundle" className="animate-fade-in">
              {bundleDeals.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {bundleDeals.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} featured={true} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No bundle offers available at the moment. Check back later!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Deal Banner */}
          <div className="bg-secondary rounded-xl p-8 my-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">Special Offer</h2>
                <p className="text-primary/80 mb-4">Get 20% off on all electronics for a limited time!</p>
                <div className="flex gap-2 justify-center md:justify-start">
                  <div className="bg-primary text-white p-2 rounded">
                    <div className="text-2xl font-bold">02</div>
                    <div className="text-xs">Days</div>
                  </div>
                  <div className="bg-primary text-white p-2 rounded">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs">Hours</div>
                  </div>
                  <div className="bg-primary text-white p-2 rounded">
                    <div className="text-2xl font-bold">45</div>
                    <div className="text-xs">Mins</div>
                  </div>
                  <div className="bg-primary text-white p-2 rounded">
                    <div className="text-2xl font-bold">18</div>
                    <div className="text-xs">Secs</div>
                  </div>
                </div>
              </div>
              <div>
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-colors">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Deals;
