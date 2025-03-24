import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getProductById } from '@/services/productService';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading product",
        description: "Please try again later",
        variant: "destructive"
      });
      navigate('/products');
    }
  }, [error, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedVariant);
    toast({
      title: "Product added to cart",
      description: `${product.name} x${quantity} added to your cart.`,
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-6 md:px-12 py-24 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-auto rounded-xl shadow-md"
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
            <p className="text-muted-foreground mb-4">{product.description}</p>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-semibold">${product.price.toFixed(2)}</span>
              {product.old_price && (
                <span className="text-muted-foreground line-through text-sm">
                  ${product.old_price.toFixed(2)}
                </span>
              )}
            </div>

            <Separator className="my-4" />

            {product.variants && product.variants.length > 0 && (
              <div className="mb-4">
                <Label htmlFor="variant">Select Variant</Label>
                <Select onValueChange={setSelectedVariant}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="mb-4">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-24"
              />
            </div>

            <Button onClick={handleAddToCart} className="w-full">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
