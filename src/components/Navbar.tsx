
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Heart, Store, User, LogIn, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchBar } from './SearchBar';
import { CartDrawer } from './CartDrawer';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useMobileMenu } from '@/hooks';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isOpen: isMobileMenuOpen, toggle: toggleMobileMenu, close: closeMobileMenu } = useMobileMenu();
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();
  const { cartItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white/90 backdrop-blur-lg shadow-sm" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="text-xl md:text-2xl font-medium tracking-tight animate-fade-in">
            VENDORA
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 animate-fade-in">
            <Link to="/" className="text-sm text-primary hover:text-primary/80 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-sm text-primary hover:text-primary/80 transition-colors">
              Products
            </Link>
            <Link to="/categories" className="text-sm text-primary hover:text-primary/80 transition-colors">
              Categories
            </Link>
            <Link to="/deals" className="text-sm text-primary hover:text-primary/80 transition-colors">
              Deals
            </Link>
            {user?.is_vendor ? (
              <Link to="/vendor/dashboard" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center">
                <Store size={16} className="mr-1" />
                Vendor Dashboard
              </Link>
            ) : (
              <Link to="/vendor/login" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center">
                <Store size={16} className="mr-1" />
                Sell on Vendora
              </Link>
            )}
          </nav>
          
          {/* Right Actions */}
          <div className="flex items-center space-x-1 md:space-x-4 animate-fade-in">
            <SearchBar />
            
            {user && (
              <Link to="/wishlist" className="p-2 hover:bg-secondary rounded-full transition-colors relative">
                <Heart size={20} className="text-primary" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-[10px] font-medium flex items-center justify-center text-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            )}
            
            {user && <CartDrawer />}
            
            {/* Authentication buttons for desktop */}
            {!user ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <LogIn size={16} className="mr-1" />
                    Login
                  </Button>
                </Link>
                <Link to="/login?tab=register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            ) : (
              <Link to="/profile" className="hidden md:flex items-center p-2 hover:bg-secondary rounded-full transition-colors">
                <User size={20} className="text-primary" />
              </Link>
            )}
            
            <button 
              className="md:hidden p-2 hover:bg-secondary rounded-full transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={20} className="text-primary" />
              ) : (
                <Menu size={20} className="text-primary" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 pt-16 bg-white z-40 animate-slide-in-right overflow-y-auto">
          <div className="absolute top-4 right-4">
            <Button 
              variant="ghost"
              size="icon"
              onClick={closeMobileMenu}
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
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-lg text-primary hover:text-primary/80 transition-colors"
                onClick={closeMobileMenu}
              >
                Products
              </Link>
              <Link 
                to="/categories" 
                className="text-lg text-primary hover:text-primary/80 transition-colors"
                onClick={closeMobileMenu}
              >
                Categories
              </Link>
              <Link 
                to="/deals" 
                className="text-lg text-primary hover:text-primary/80 transition-colors"
                onClick={closeMobileMenu}
              >
                Deals
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/wishlist" 
                    className="text-lg text-primary hover:text-primary/80 transition-colors flex items-center"
                    onClick={closeMobileMenu}
                  >
                    <Heart size={18} className="mr-2" />
                    Wishlist
                  </Link>
                  <Link 
                    to="/profile" 
                    className="text-lg text-primary hover:text-primary/80 transition-colors flex items-center"
                    onClick={closeMobileMenu}
                  >
                    <User size={18} className="mr-2" />
                    My Account
                  </Link>
                  <Link 
                    to="/cart" 
                    className="text-lg text-primary hover:text-primary/80 transition-colors flex items-center"
                    onClick={closeMobileMenu}
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    Cart
                  </Link>
                  {user.is_vendor && (
                    <Link 
                      to="/vendor/dashboard" 
                      className="text-lg text-primary hover:text-primary/80 transition-colors flex items-center"
                      onClick={closeMobileMenu}
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
                    onClick={closeMobileMenu}
                  >
                    <LogIn size={18} className="mr-2" />
                    Login
                  </Link>
                  <Link 
                    to="/login?tab=register" 
                    className="text-lg text-primary hover:text-primary/80 transition-colors flex items-center"
                    onClick={closeMobileMenu}
                  >
                    <User size={18} className="mr-2" />
                    Sign Up
                  </Link>
                  <Link 
                    to="/vendor/login" 
                    className="text-lg text-primary hover:text-primary/80 transition-colors flex items-center"
                    onClick={closeMobileMenu}
                  >
                    <Store size={18} className="mr-2" />
                    Sell on Vendora
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
