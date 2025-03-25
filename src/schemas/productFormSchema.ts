
import * as z from 'zod';

export const productFormSchema = z.object({
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

export type ProductFormValues = z.infer<typeof productFormSchema>;
