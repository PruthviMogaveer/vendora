
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Heart, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '../SearchBar';
import { CartDrawer } from '../CartDrawer';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { useMobileMenu } from '@/hooks';

export const NavbarActions = () => {
  const { isOpen, toggle } = useMobileMenu();
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();

  return (
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
        onClick={toggle}
        aria-label="Toggle menu"
      >
        <Menu size={20} className="text-primary" />
      </button>
    </div>
  );
};
