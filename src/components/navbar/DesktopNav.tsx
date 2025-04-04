
import React from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const DesktopNav = () => {
  const { user } = useAuth();

  return (
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
  );
};
