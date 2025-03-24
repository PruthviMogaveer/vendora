
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowLeft,
  Check,
  Star,
  Truck,
  RefreshCw
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { getProductById, getFeaturedProducts } from '@/data/products';
import { ProductVariant } from '@/types/product';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = id ? getProductById(id) : undefined;
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  
  const featuredProducts = getFeaturedProducts().filter(p => p.id !== id);
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg mb-4">Product not found</p>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }
  
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleVariantChange = (variantId: string, option: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantId]: option
    }));
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6 md:px-12">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm mb-8 hover:text-primary/70 animate-fade-in"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="animate-fade-in">
              <div className="aspect-square overflow-hidden rounded-xl mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-primary'
                          : 'border-transparent hover:border-primary/30'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="animate-slide-up">
              {product.badge && (
                <div className="inline-block px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary/80 mb-4">
                  {product.badge}
                </div>
              )}
              
              <h1 className="text-3xl font-medium tracking-tight mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-primary/70 ml-2">
                  (24 reviews)
                </span>
              </div>
              
              <div className="flex items-baseline mb-6">
                <span className="text-2xl font-medium mr-2">
                  ${product.price.toFixed(2)}
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-primary/60 line-through">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              <p className="text-primary/80 mb-8">{product.description}</p>
              
              <Separator className="mb-6" />
              
              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-6 mb-6">
                  {product.variants.map((variant: ProductVariant) => (
                    <div key={variant.id}>
                      <h3 className="text-sm font-medium mb-3 capitalize">
                        {variant.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map(option => (
                          <button
                            key={option}
                            onClick={() => handleVariantChange(variant.id, option)}
                            className={`px-4 py-2 rounded-md text-sm border ${
                              selectedVariants[variant.id] === option
                                ? 'border-primary bg-primary/5'
                                : 'border-input hover:border-primary/50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Quantity</h3>
                <div className="flex h-10 w-32">
                  <button
                    onClick={decreaseQuantity}
                    className="flex-none flex items-center justify-center w-10 border border-r-0 border-input rounded-l-md hover:bg-secondary"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="flex-grow flex items-center justify-center border-y border-input">
                    {quantity}
                  </div>
                  <button
                    onClick={increaseQuantity}
                    className="flex-none flex items-center justify-center w-10 border border-l-0 border-input rounded-r-md hover:bg-secondary"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              {/* Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button 
                  onClick={handleAddToCart}
                  className="btn-hover flex-1 h-12"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button 
                  onClick={() => {
                    addToCart(product, quantity);
                    navigate('/cart');
                  }}
                  variant="outline"
                  className="flex-1 h-12"
                >
                  Buy Now
                </Button>
              </div>
              
              {/* Shipping Info */}
              <div className="space-y-4 text-sm">
                <div className="flex items-center text-primary/80">
                  <Check size={16} className="mr-2 text-primary" />
                  In stock and ready to ship
                </div>
                <div className="flex items-center text-primary/80">
                  <Truck size={16} className="mr-2 text-primary" />
                  Free shipping on orders over $100
                </div>
                <div className="flex items-center text-primary/80">
                  <RefreshCw size={16} className="mr-2 text-primary" />
                  30-day returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {featuredProducts.length > 0 && (
        <FeaturedProducts
          title="You Might Also Like"
          products={featuredProducts.slice(0, 4)}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
