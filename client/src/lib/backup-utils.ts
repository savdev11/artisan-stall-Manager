import { appBackupSchema, type AppBackup, type Product } from "@shared/schema";

export function buildBackup(products: Product[], categories: string[]): AppBackup {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    sourceOrigin: window.location.origin,
    categories,
    hasExported: true,
    products,
  };
}

export function serializeBackup(backup: AppBackup): string {
  return JSON.stringify(backup, null, 2);
}

export function parseBackup(content: string): AppBackup {
  let raw: unknown;

  try {
    raw = JSON.parse(content);
  } catch {
    throw new Error("Il file non e un JSON valido.");
  }

  const parsed = appBackupSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error("Formato backup non valido o incompleto.");
  }

  return parsed.data;
}
