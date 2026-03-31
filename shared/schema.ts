import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  category: z.string().default(""),
  price: z.number().min(0, "Price must be positive"),
  initialQuantity: z.number().int().min(0, "Quantity must be 0 or more"),
  soldCount: z.number().int().min(0).default(0),
  createdCount: z.number().int().min(0).default(0),
  image: z.string().nullable(),
});

export const insertProductSchema = productSchema.omit({
  id: true,
  soldCount: true,
  createdCount: true,
});

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type AppScreen = "home" | "import" | "manual" | "sales" | "settings";

export const DEFAULT_CATEGORIES = [
  "Collane",
  "Braccialetti",
  "Anelli",
  "Orecchini",
  "Ciondoli",
  "Accessori",
  "Altro",
];

export interface AppState {
  products: Product[];
  hasUnsavedChanges: boolean;
  currentScreen: AppScreen;
}

export const appBackupSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  sourceOrigin: z.string(),
  categories: z.array(z.string()),
  hasExported: z.boolean().default(true),
  products: z.array(productSchema),
});

export type AppBackup = z.infer<typeof appBackupSchema>;
