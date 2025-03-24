import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast';
import { createProduct, updateProduct, getProductById, addProductVariant } from '@/services/productService';
import { Product } from '@/types/product';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.number({
    invalid_type_error: "Price must be a number.",
  }).min(0.01, {
    message: "Price must be greater than 0.",
  }),
  old_price: z.number({
    invalid_type_error: "Old price must be a number.",
  }).optional(),
  category: z.string().optional(),
  images: z.array(z.string()).optional(),
  badge: z.string().optional(),
  featured: z.boolean().default(false).optional(),
  in_stock: z.boolean().default(true).optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const ProductForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id: productId } = useParams<{ id: string }>();
  const editMode = !!productId;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      old_price: 0,
      category: "",
      images: [],
      badge: "",
      featured: false,
      in_stock: true,
    },
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    old_price: 0,
    category: '',
    images: [] as string[],
    vendor_id: '',
    badge: '',
    featured: false,
    in_stock: true,
  });

  useEffect(() => {
    if (editMode && productId) {
      const fetchProductData = async () => {
        const product = await getProductById(productId);
        if (product) {
          setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            old_price: product.old_price || 0,
            category: product.category,
            images: product.images,
            vendor_id: product.vendor_id || '',
            badge: product.badge || '',
            featured: product.featured || false,
            in_stock: product.in_stock || true,
          });

          // Update form default values
          form.reset({
            name: product.name,
            description: product.description,
            price: product.price,
            old_price: product.old_price || 0,
            category: product.category,
            images: product.images,
            badge: product.badge || '',
            featured: product.featured || false,
            in_stock: product.in_stock || true,
          });
        } else {
          toast({
            title: "Error loading product",
            description: "Product not found",
            variant: "destructive",
          });
          navigate("/vendor/dashboard");
        }
      };
      fetchProductData();
    }
  }, [editMode, productId, navigate, toast, form]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const userData = await supabase.auth.getUser();
      if (!userData.data.user) {
        throw new Error("You must be logged in to create or edit products");
      }

      // Ensure all required fields are present
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        old_price: formData.old_price,
        category: formData.category || "uncategorized", // Default value to satisfy required field
        images: formData.images.length > 0 ? formData.images : ["https://placehold.co/600x400?text=No+Image"], // Default image
        vendor_id: userData.data.user.id,
        badge: formData.badge,
        featured: formData.featured,
        in_stock: formData.in_stock
      };

      let result;
      if (editMode && productId) {
        // Update existing product
        result = await updateProduct(productId, productData);
      } else {
        // Create new product
        result = await createProduct(productData);
      }

      if (!result) {
        throw new Error("Failed to save product");
      }

      toast({
        title: `Product ${editMode ? "updated" : "created"} successfully`,
        variant: "default",
      });

      // Redirect to vendor dashboard
      navigate("/vendor/dashboard");
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error saving product",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto py-12 flex-grow">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{editMode ? "Edit Product" : "Create New Product"}</CardTitle>
              <CardDescription>
                {editMode ? "Edit the details of your product." : "Add a new product to your store."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Product Name" {...field} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Product Description"
                            className="resize-none"
                            {...field}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Price" {...field} value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="old_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Old Price (Optional)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Old Price" {...field} value={formData.old_price} onChange={(e) => setFormData({ ...formData, old_price: parseFloat(e.target.value) })} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={(value) => setFormData({ ...formData, category: value })} defaultValue={formData.category}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="home-decor">Home Decor</SelectItem>
                            {/* Add more categories as needed */}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Images (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Image URLs (comma-separated)"
                            {...field}
                            value={formData.images.join(',')}
                            onChange={(e) => setFormData({ ...formData, images: e.target.value.split(',') })}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter image URLs separated by commas.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="badge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Badge (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Badge" {...field} value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={formData.featured}
                                onCheckedChange={(checked) => {
                                  // Ensure we're setting a boolean value
                                  setFormData({ ...formData, featured: checked === true });
                                }}
                              />
                            </FormControl>
                            <FormLabel>Featured</FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="in_stock"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={formData.in_stock}
                                onCheckedChange={(checked) => {
                                  // Ensure we're setting a boolean value
                                  setFormData({ ...formData, in_stock: checked === true });
                                }}
                              />
                            </FormControl>
                            <FormLabel>In Stock</FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Product"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductForm;
