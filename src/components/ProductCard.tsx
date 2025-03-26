
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Heart, Eye } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
  onQuickView?: (product: Product) => void;
}

export const ProductCard = ({ product, featured = false, onQuickView }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Product added",
      description: `${product.name} added to your cart.`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    if (onQuickView) {
      e.preventDefault();
      e.stopPropagation();
      onQuickView(product);
    }
  };

  return (
    <Link 
      to={`/products/${product.id}`} 
      className={cn(
        "group product-card block rounded-xl overflow-hidden bg-white",
        featured ? "shadow-sm" : "border border-border"
      )}
    >
      <div className="relative aspect-square img-hover-zoom">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {product.badge && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-md">
            {product.badge}
          </div>
        )}
        
        {/* New Product Actions */}
        <div className="absolute top-3 right-3 space-y-2 opacity-0 transform translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full shadow-md ${
              isInWishlist(product.id) 
                ? 'bg-rose-50 text-rose-500' 
                : 'bg-white text-primary hover:text-rose-500'
            }`}
            aria-label="Add to wishlist"
          >
            <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
          </button>
          
          {onQuickView && (
            <button
              onClick={handleQuickView}
              className="p-2 bg-white rounded-full shadow-md text-primary hover:text-primary/70"
              aria-label="Quick view"
            >
              <Eye size={16} />
            </button>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 transform translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          aria-label="Add to cart"
        >
          <Plus size={16} className="text-primary" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-base mb-1 tracking-tight">
          {product.name}
        </h3>
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">
            ${product.price.toFixed(2)}
          </p>
          {product.old_price && (
            <p className="text-xs text-muted-foreground line-through">
              ${product.old_price.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
