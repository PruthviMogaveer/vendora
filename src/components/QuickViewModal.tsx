
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, Star, Check } from 'lucide-react';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const QuickViewModal = ({ isOpen, onClose, product }: QuickViewModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant || undefined);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
    onClose();
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  // Default rating and review count for display purposes
  const rating = 4;
  const reviewsCount = 12;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Product Image */}
          <div className="aspect-square bg-secondary/20">
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Details */}
          <div className="p-6 flex flex-col">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-semibold">{product.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-1 text-sm">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      fill={i < rating ? "currentColor" : "none"} 
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">({reviewsCount} reviews)</span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-semibold">${product.price.toFixed(2)}</span>
                {product.old_price && (
                  <span className="text-muted-foreground line-through text-sm">
                    ${product.old_price.toFixed(2)}
                  </span>
                )}
                
                {product.old_price && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                    {Math.round((1 - product.price / product.old_price) * 100)}% OFF
                  </span>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground">{product.description}</p>
              
              {/* Stock Status */}
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <Check size={14} />
                  <span>In Stock</span>
                </div>
                <span className="text-muted-foreground">• Free shipping</span>
              </div>
              
              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <label className="text-sm font-medium block mb-2">Options</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        className={`px-3 py-1 text-sm border rounded-full ${
                          selectedVariant === variant.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background hover:bg-secondary'
                        }`}
                        onClick={() => setSelectedVariant(variant.id)}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity */}
              <div>
                <label className="text-sm font-medium block mb-2">Quantity</label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={decrementQuantity}
                      className="px-3 py-1 hover:bg-secondary"
                    >
                      -
                    </button>
                    <span className="px-3">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="px-3 py-1 hover:bg-secondary"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button onClick={handleAddToCart} className="w-full">
                Add to Cart
              </Button>
              <Link to={`/products/${product.id}`} className="w-full">
                <Button variant="outline" className="w-full group">
                  View Details <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
