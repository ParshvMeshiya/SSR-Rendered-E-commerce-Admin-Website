import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  costPrice: z.number().min(0).optional(),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).optional(),
  category: z.enum([
    "Electronics",
    "Clothing",
    "Food",
    "Books",
    "Home",
    "Sports",
    "Beauty",
    "Toys",
    "Other",
  ]),
  subCategory: z.string().optional(),
  brand: z.string().optional(),
  sku: z.string().min(1).transform((v) => v.toUpperCase()),
  stock: z.number().min(0),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "active", "archived"]),
  featured: z.boolean(),
  weight: z
    .object({
      value: z.number().optional(),
      unit: z.enum(["kg", "g", "lb", "oz"]).optional(),
    })
    .optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
});
