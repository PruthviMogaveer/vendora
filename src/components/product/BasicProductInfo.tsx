
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

interface BasicProductInfoProps {
  formData: {
    name: string;
    description: string;
    price: number;
    old_price: number;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const BasicProductInfo: React.FC<BasicProductInfoProps> = ({ 
  formData, 
  setFormData 
}) => {
  const form = useFormContext();

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Product Name" 
                {...field} 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              />
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
              <Input 
                type="number" 
                placeholder="Price" 
                {...field} 
                value={formData.price} 
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} 
              />
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
              <Input 
                type="number" 
                placeholder="Old Price" 
                {...field} 
                value={formData.old_price} 
                onChange={(e) => setFormData({ ...formData, old_price: parseFloat(e.target.value) })} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
