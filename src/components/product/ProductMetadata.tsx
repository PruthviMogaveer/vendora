
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from "react-hook-form";

interface ProductMetadataProps {
  formData: {
    category: string;
    images: string[];
    badge: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const ProductMetadata: React.FC<ProductMetadataProps> = ({ 
  formData, 
  setFormData 
}) => {
  const form = useFormContext();

  return (
    <>
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select 
              onValueChange={(value) => setFormData({ ...formData, category: value })} 
              defaultValue={formData.category}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="home-decor">Home Decor</SelectItem>
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
              <Input 
                placeholder="Badge" 
                {...field} 
                value={formData.badge} 
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
