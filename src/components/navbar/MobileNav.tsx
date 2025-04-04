
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Store, User, LogIn, ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useMobileMenu } from '@/hooks';

export const MobileNav = () => {
  const { isOpen, close } = useMobileMenu();
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 pt-16 bg-white z-40 animate-slide-in-right overflow-y-auto">
      <div className="absolute top-4 right-4">
        <Button 
          variant="ghost"
          size="icon"
          onClick={close}
          aria-label="Close menu"
          className="rounded-full hover:bg-secondary"
        >
          <X size={24} className="text-primary" />
        </Button>
      </div>
      <div className="container mx-auto px-6 py-8">
        <nav className="flex flex-col space-y-6">
          <Link 
            to="/" 
            className="text-lg text-primary hover:text-primary/80 transition-colors"
            onClick={close}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className="text-lg text-primary hover:text-primary/80 transition-colors"
            onClick={close}
          >
            Products
          </Link>
          <Link 
            to="/categories" 
            className="text-lg text-primary hover:text-primary/80 transition-colors"
            onClick={close}
          >
            Categories
          </Link>
          <Link 
            to="/deals" 
            className="text-lg text-primary hover:text-primary/80 transition-colors"
            onClick={close}
          >
            Deals
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/wishlist" 
                className="text-lg text-primary hover:text-primary/80 transition-colors flex items-center"
                onClick={close}
              >
                <Heart size={18} className="mr-2" />
                Wishlist
              </Link>
              <Link 
                to="/profile" 
                className="text-lg text-primary hover:text-primary/80 transition-colors flex items-center"
                onClick={close}
              >
                <User size={18} className="mr-2" />
                My Account
              </Link>
              <Link 
                to="/cart" 
                className="text-lg text-primary hover:text-primary/80 transition-colors flex items-center"
                onClick={close}
              >
                <ShoppingBag size={18} className="mr-2" />
                Cart
              </Link>
              {user.is_vendor && (
                <Link 
                  to="/vendor/dashboard" 
                  className="text-lg text-primary hover:text-primary/80 transition-colors flex items-center"
                  onClick={close}
                >
                  <Store size={18} className="mr-2" />
                  Vendor Dashboard
                </Link>
              )}
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-lg text-primary hover:text-primary/80 transition-colors flex items-center"
                onClick={close}
              >
                <LogIn size={18} className="mr-2" />
                Login
              </Link>
              <Link 
                to="/login?tab=register" 
                className="text-lg text-primary hover:text-primary/80 transition-colors flex items-center"
                onClick={close}
              >
                <User size={18} className="mr-2" />
                Sign Up
              </Link>
              <Link 
                to="/vendor/login" 
                className="text-lg text-primary hover:text-primary/80 transition-colors flex items-center"
                onClick={close}
              >
                <Store size={18} className="mr-2" />
                Sell on Vendora
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};
