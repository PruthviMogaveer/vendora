
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export const ProductCard = ({ product, featured = false }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
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
