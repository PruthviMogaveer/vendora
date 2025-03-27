
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeLayout } from '@/components/home/HomeLayout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  CreditCard, 
  Check,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    getCartTotal,
    clearCart
  } = useCart();
  
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const cartTotal = getCartTotal();
  const shippingCost = cartTotal > 100 ? 0 : 10;
  const orderTotal = cartTotal + shippingCost;
  
  // Check if user is authenticated
  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to continue checkout');
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [user, loading, navigate]);

  // If cart is empty or still checking auth, redirect or show loading
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }
  
  if (loading) {
    return (
      <HomeLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </HomeLayout>
    );
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to complete your purchase');
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <HomeLayout>
      <div className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-6 md:px-12">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center text-sm mb-8 hover:text-primary/70 animate-fade-in"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </button>
          
          <h1 className="text-3xl font-medium tracking-tight mb-8 animate-slide-up">
            Checkout
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2 animate-slide-up">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Contact Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        defaultValue={user?.first_name || ''}
                        placeholder="John" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        defaultValue={user?.last_name || ''}
                        placeholder="Doe" 
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      defaultValue={user?.email || ''}
                      placeholder="john.doe@example.com" 
                      required
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      placeholder="(555) 123-4567" 
                      required
                    />
                  </div>
                </div>
                
                <Separator />
                
                {/* Shipping Address */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Shipping Address</h2>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      defaultValue={user?.address || ''}
                      placeholder="123 Main St" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Apartment, suite, etc. (optional)</Label>
                    <Input 
                      id="addressLine2" 
                      placeholder="Apt 4B" 
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        defaultValue={user?.city || ''}
                        placeholder="San Francisco" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input 
                        id="state" 
                        defaultValue={user?.state || ''}
                        placeholder="California" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP/Postal Code</Label>
                      <Input 
                        id="zip" 
                        defaultValue={user?.zip_code || ''}
                        placeholder="94103" 
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Payment */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Payment Method</h2>
                  <div className="p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard size={20} />
                      <span className="font-medium">Credit Card</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input 
                          id="cardNumber" 
                          placeholder="1234 5678 9012 3456" 
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiration Date</Label>
                          <Input 
                            id="expiry" 
                            placeholder="MM/YY" 
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input 
                            id="cvc" 
                            placeholder="123" 
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-primary/70">
                    <Lock size={14} />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </div>
                
                {/* Review & Place Order */}
                <Button
                  type="submit"
                  className="btn-hover w-full h-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </Button>
              </form>
            </div>
            
            {/* Order Summary */}
            <div className="animate-slide-up">
              <div className="sticky top-24 bg-secondary/30 rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0 right-0 h-5 w-5 rounded-full bg-primary/80 text-[10px] font-medium flex items-center justify-center text-white">
                          {item.quantity}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-primary/70 mb-1">
                          {item.variant && `Variant: ${item.variant}`}
                        </p>
                        <p className="text-sm">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
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
                
                <div className="flex items-center gap-2 text-sm text-primary/80 border-t border-border pt-4">
                  <ShieldCheck size={16} className="text-green-600" />
                  <span>100% Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default Checkout;
