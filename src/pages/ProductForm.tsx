
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductVariant } from '@/types/product';

const categories = [
  'home', 'accessories', 'electronics', 'clothing', 'kitchen'
];

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    old_price: undefined,
    images: [''],
    category: '',
    badge: '',
    featured: false,
    in_stock: true,
  });
  
  const [variants, setVariants] = useState<Partial<ProductVariant>[]>([]);
  const [newVariant, setNewVariant] = useState<Partial<ProductVariant>>({
    name: '',
    options: ['']
  });

  useEffect(() => {
    if (isEditing && id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      // Fetch product
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      // Fetch variants
      const { data: productVariants, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId);

      if (variantsError) throw variantsError;

      if (product) {
        setFormData(product);
      }

      if (productVariants) {
        setVariants(productVariants);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to load product data.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const inputValue = type === 'number' ? parseFloat(value) : value;
    setFormData(prev => ({ ...prev, [name]: inputValue }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [''])];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ 
      ...prev, 
      images: [...(prev.images || []), ''] 
    }));
  };

  const removeImageField = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleNewVariantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVariant(prev => ({ ...prev, [name]: value }));
  };

  const handleVariantOptionChange = (index: number, value: string) => {
    const newOptions = [...(newVariant.options || [''])];
    newOptions[index] = value;
    setNewVariant(prev => ({ ...prev, options: newOptions }));
  };

  const addVariantOptionField = () => {
    setNewVariant(prev => ({ 
      ...prev, 
      options: [...(prev.options || []), ''] 
    }));
  };

  const removeVariantOptionField = (index: number) => {
    const newOptions = [...(newVariant.options || [])];
    newOptions.splice(index, 1);
    setNewVariant(prev => ({ ...prev, options: newOptions }));
  };

  const addVariant = () => {
    // Validate variant data
    if (!newVariant.name || !newVariant.options?.length || newVariant.options.some(opt => !opt)) {
      toast({
        title: "Validation Error",
        description: "Variant name and all options must be filled.",
        variant: "destructive",
      });
      return;
    }
    
    setVariants(prev => [...prev, newVariant]);
    setNewVariant({ name: '', options: [''] });
  };

  const removeVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.description || !formData.category || !formData.images?.length) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields and add at least one image.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const productData = {
        ...formData,
        vendor_id: user?.id,
      };
      
      if (isEditing && id) {
        // Update product
        const { data: updatedProduct, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        // Handle variants - first delete existing ones
        const { error: deleteError } = await supabase
          .from('product_variants')
          .delete()
          .eq('product_id', id);
        
        if (deleteError) throw deleteError;
        
        // Insert new variants
        if (variants.length > 0) {
          const variantsData = variants.map(variant => ({
            product_id: id,
            name: variant.name,
            options: variant.options
          }));
          
          const { error: variantsError } = await supabase
            .from('product_variants')
            .insert(variantsData);
          
          if (variantsError) throw variantsError;
        }
        
        toast({
          title: "Success",
          description: "Product updated successfully.",
        });
      } else {
        // Create new product
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();
        
        if (error) throw error;
        
        // Insert variants if any
        if (variants.length > 0 && newProduct) {
          const variantsData = variants.map(variant => ({
            product_id: newProduct.id,
            name: variant.name,
            options: variant.options
          }));
          
          const { error: variantsError } = await supabase
            .from('product_variants')
            .insert(variantsData);
          
          if (variantsError) throw variantsError;
        }
        
        toast({
          title: "Success",
          description: "Product created successfully.",
        });
      }
      
      // Redirect back to vendor dashboard
      navigate('/vendor/dashboard');
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold text-center mb-8">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange}
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input 
                        id="price" 
                        name="price" 
                        type="number" 
                        step="0.01" 
                        min="0"
                        value={formData.price} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="old_price">Old Price ($) (Optional)</Label>
                      <Input 
                        id="old_price" 
                        name="old_price" 
                        type="number" 
                        step="0.01" 
                        min="0"
                        value={formData.old_price || ''} 
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="badge">Badge (Optional)</Label>
                    <Input 
                      id="badge" 
                      name="badge" 
                      placeholder="e.g., New, Sale, Best Seller"
                      value={formData.badge || ''} 
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="in_stock"
                        checked={formData.in_stock} 
                        onCheckedChange={(checked) => handleSwitchChange('in_stock', checked)}
                      />
                      <Label htmlFor="in_stock">In Stock</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="featured"
                        checked={formData.featured} 
                        onCheckedChange={(checked) => handleSwitchChange('featured', checked)}
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.images?.map((image, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input 
                          placeholder="Image URL"
                          value={image} 
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          required
                        />
                        {formData.images && formData.images.length > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon"
                            onClick={() => removeImageField(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={addImageField}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Another Image
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Product Variants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {variants.map((variant, variantIndex) => (
                      <div key={variantIndex} className="p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{variant.name}</h3>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeVariant(variantIndex)}
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="pl-4 border-l-2 space-y-2">
                          <p className="text-sm text-muted-foreground">Options:</p>
                          <ul className="list-disc pl-4">
                            {variant.options?.map((option, optIndex) => (
                              <li key={optIndex}>{option}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                    
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Add New Variant</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="variantName">Variant Name</Label>
                          <Input 
                            id="variantName" 
                            name="name" 
                            placeholder="e.g., Color, Size"
                            value={newVariant.name} 
                            onChange={handleNewVariantChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Options</Label>
                          {newVariant.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-2">
                              <Input 
                                placeholder="Option value"
                                value={option} 
                                onChange={(e) => handleVariantOptionChange(optIndex, e.target.value)}
                              />
                              {newVariant.options && newVariant.options.length > 1 && (
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => removeVariantOptionField(optIndex)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={addVariantOptionField}
                          >
                            <Plus className="h-4 w-4 mr-2" /> Add Option
                          </Button>
                        </div>
                        
                        <Button 
                          type="button" 
                          onClick={addVariant}
                        >
                          Add Variant
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/vendor/dashboard')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
                </Button>
              </CardFooter>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductForm;
