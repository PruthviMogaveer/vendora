
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import { SearchBar } from './SearchBar';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCartItemsCount } = useCart();
  const itemCount = getCartItemsCount();

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
      isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
    )}>
      <div className="container mx-auto px-6 md:px-12">
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
            <Link to="/about" className="text-sm text-primary hover:text-primary/80 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm text-primary hover:text-primary/80 transition-colors">
              Contact
            </Link>
          </nav>
          
          {/* Right Actions */}
          <div className="flex items-center space-x-4 animate-fade-in">
            <SearchBar />
            <Link to="/cart" className="p-2 hover:bg-secondary rounded-full transition-colors relative">
              <ShoppingBag size={20} className="text-primary" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-white">
                  {itemCount}
                </span>
              )}
            </Link>
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
                to="/about" 
                className="text-lg text-primary hover:text-primary/80 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-lg text-primary hover:text-primary/80 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                to="/login" 
                className="text-lg text-primary hover:text-primary/80 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
