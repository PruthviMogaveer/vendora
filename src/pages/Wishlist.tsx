
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useWishlist } from '@/hooks/useWishlist';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">
              Your Wishlist
            </h1>
            <p className="text-primary/80 max-w-2xl mx-auto">
              Items you've saved for later. Add them to your cart when you're ready to purchase.
            </p>
          </div>
          
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16 px-4 animate-slide-up">
              <div className="inline-block p-6 bg-muted rounded-full mb-4">
                <Heart size={32} className="text-muted-foreground" />
              </div>
              <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Find items you love and click the heart icon to add them to your wishlist.
              </p>
              <Link to="/products">
                <Button className="animate-pulse">
                  <ShoppingBag className="mr-2 h-4 w-4" /> Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistItems.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProductCard 
                      product={product} 
                      featured={true}
                      onQuickView={handleQuickView}
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <Link to="/products">
                  <Button variant="outline" className="animate-pulse">
                    <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      
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

export default Wishlist;
