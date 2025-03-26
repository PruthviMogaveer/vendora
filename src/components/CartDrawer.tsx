
import React from 'react';
import { ShoppingBag, X, Trash2, ChevronRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';

export const CartDrawer = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 hover:bg-secondary rounded-full transition-colors relative">
          <ShoppingBag size={20} className="text-primary" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-white">
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag size={18} /> Your Cart
          </SheetTitle>
        </SheetHeader>
        
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
            <div className="bg-secondary/50 p-6 rounded-full">
              <ShoppingBag size={32} className="text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-medium mb-1">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mb-4">Add items to get started</p>
              <Link to="/products">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto space-y-4 pr-2 -mr-2">
              {cartItems.map((item) => (
                <div key={`${item.product.id}-${item.variant}`} className="flex gap-3 animate-fade-in">
                  <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0 bg-secondary/30">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {item.variant && (
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.variant}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 text-xs"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-xs"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-medium text-sm">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-auto pt-4">
              <Separator className="mb-4" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                
                <div className="grid gap-2 mt-4">
                  <Link to="/cart" className="w-full">
                    <Button className="w-full" variant="outline">View Cart</Button>
                  </Link>
                  <Link to="/checkout" className="w-full">
                    <Button className="w-full group">
                      Checkout <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
