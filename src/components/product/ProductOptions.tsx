
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext } from "react-hook-form";

interface ProductOptionsProps {
  formData: {
    featured: boolean;
    in_stock: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const ProductOptions: React.FC<ProductOptionsProps> = ({ 
  formData, 
  setFormData 
}) => {
  const form = useFormContext();

  return (
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
  );
};
