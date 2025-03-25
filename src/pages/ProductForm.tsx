
import React from 'react';
import { Button } from '@/components/ui/button';
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useProductForm } from '@/hooks/useProductForm';
import { BasicProductInfo } from '@/components/product/BasicProductInfo';
import { ProductMetadata } from '@/components/product/ProductMetadata';
import { ProductOptions } from '@/components/product/ProductOptions';

const ProductForm = () => {
  const { 
    form, 
    formData, 
    setFormData, 
    isSubmitting, 
    editMode, 
    handleSubmit 
  } = useProductForm();

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
                  <BasicProductInfo formData={formData} setFormData={setFormData} />
                  <ProductMetadata formData={formData} setFormData={setFormData} />
                  <ProductOptions formData={formData} setFormData={setFormData} />
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
