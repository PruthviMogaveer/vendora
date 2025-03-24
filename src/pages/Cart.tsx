
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Minus, 
  Plus, 
  X, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getCartTotal 
  } = useCart();
  const navigate = useNavigate();
  
  const cartTotal = getCartTotal();
  const shippingCost = cartTotal > 100 ? 0 : 10;
  const orderTotal = cartTotal + shippingCost;
  
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 flex flex-col items-center justify-center py-12">
          <div className="text-center max-w-md mx-auto px-6 animate-slide-up">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center">
                <ShoppingBag size={32} className="text-primary/70" />
              </div>
            </div>
            <h1 className="text-2xl font-medium mb-4">Your cart is empty</h1>
            <p className="text-primary/70 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button 
              onClick={() => navigate('/products')}
              className="btn-hover"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-6 md:px-12">
          <h1 className="text-3xl font-medium tracking-tight mb-8 animate-slide-up">
            Your Cart
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 animate-slide-up">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div 
                    key={item.product.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-border animate-fade-in"
                  >
                    {/* Product Image */}
                    <div className="sm:w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <Link
                          to={`/products/${item.product.id}`}
                          className="font-medium hover:text-primary/70"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-primary/60 hover:text-primary transition-colors"
                          aria-label="Remove item"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      
                      {item.variant && (
                        <p className="text-sm text-primary/70 mt-1">
                          Variant: {item.variant}
                        </p>
                      )}
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex h-8">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="flex items-center justify-center w-8 border border-r-0 border-input rounded-l-md hover:bg-secondary"
                          >
                            <Minus size={14} />
                          </button>
                          <div className="flex items-center justify-center w-10 border-y border-input text-sm">
                            {item.quantity}
                          </div>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="flex items-center justify-center w-8 border border-l-0 border-input rounded-r-md hover:bg-secondary"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-medium">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-primary/60">
                              ${item.product.price.toFixed(2)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => navigate('/products')}
                  className="text-sm"
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-sm"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="animate-slide-up">
              <div className="sticky top-24 bg-secondary/30 rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-primary/70">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary/70">Shipping</span>
                    <span>
                      {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-medium mb-6">
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
                
                <Button 
                  onClick={() => navigate('/checkout')}
                  className="w-full btn-hover"
                >
                  Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <div className="mt-4 text-xs text-center text-primary/60">
                  Taxes calculated at checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;
