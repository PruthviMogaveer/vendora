
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { createProduct, updateProduct, getProductById } from '@/services/productService';
import { productFormSchema, ProductFormValues } from '@/schemas/productFormSchema';

export const useProductForm = () => {
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

  return {
    form,
    formData,
    setFormData,
    isSubmitting,
    editMode,
    handleSubmit
  };
};
