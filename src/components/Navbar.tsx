
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Heart, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchBar } from './SearchBar';
import { CartDrawer } from './CartDrawer';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();

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
            
            <Link to="/wishlist" className="p-2 hover:bg-secondary rounded-full transition-colors relative">
              <Heart size={20} className="text-primary" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-[10px] font-medium flex items-center justify-center text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            
            <CartDrawer />
            
            <button 
              className="md:hidden p-2 hover:bg-secondary rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
        <div className="md:hidden h-screen bg-white animate-slide-in-right">
          <div className="container mx-auto px-6 py-8">
            <nav className="flex flex-col space-y-6">
              <Link 
                to="/" 
                className="text-lg text-primary hover:text-primary/80 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-lg text-primary hover:text-primary/80 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/categories" 
                className="text-lg text-primary hover:text-primary/80 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                to="/deals" 
                className="text-lg text-primary hover:text-primary/80 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Deals
              </Link>
              <Link 
                to="/wishlist" 
                className="text-lg text-primary hover:text-primary/80 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Wishlist
              </Link>
              <Link 
                to="/login" 
                className="text-lg text-primary hover:text-primary/80 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              {user?.is_vendor ? (
                <Link 
                  to="/vendor/dashboard" 
                  className="text-lg text-primary hover:text-primary/80 transition-colors flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Store size={18} className="mr-2" />
                  Vendor Dashboard
                </Link>
              ) : (
                <Link 
                  to="/vendor/login" 
                  className="text-lg text-primary hover:text-primary/80 transition-colors flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Store size={18} className="mr-2" />
                  Sell on Vendora
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
