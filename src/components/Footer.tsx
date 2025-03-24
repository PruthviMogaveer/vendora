
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="text-xl font-medium tracking-tight mb-4 block">
              VENDORA
            </Link>
            <p className="text-sm text-primary/70 mb-6 max-w-xs">
              Elegance in every detail. Our curated collection brings timeless design to your everyday life.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full bg-secondary transition-colors hover:bg-secondary/70">
                <Facebook size={18} className="text-primary/80" />
              </a>
              <a href="#" className="p-2 rounded-full bg-secondary transition-colors hover:bg-secondary/70">
                <Instagram size={18} className="text-primary/80" />
              </a>
              <a href="#" className="p-2 rounded-full bg-secondary transition-colors hover:bg-secondary/70">
                <Twitter size={18} className="text-primary/80" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm text-primary/70 hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products/featured" className="text-sm text-primary/70 hover:text-primary transition-colors">
                  Featured
                </Link>
              </li>
              <li>
                <Link to="/products/new" className="text-sm text-primary/70 hover:text-primary transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/products/bestsellers" className="text-sm text-primary/70 hover:text-primary transition-colors">
                  Bestsellers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-primary/70 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-primary/70 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-primary/70 hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-primary/70 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-sm text-primary/70 hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm text-primary/70 hover:text-primary transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-primary/70 hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-primary/70 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-primary/60">
            © {new Date().getFullYear()} Vendora. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-xs text-primary/60 hover:text-primary transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-xs text-primary/60 hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link to="/cookies" className="text-xs text-primary/60 hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
