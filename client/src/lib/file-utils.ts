import type { InsertProduct, Product } from "@shared/schema";

export interface ParseResult {
  products: InsertProduct[];
  errors: string[];
  warnings: string[];
}

export function parseCSV(content: string): ParseResult {
  const lines = content.trim().split("\n");
  const products: InsertProduct[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    
    if (!line.trim()) {
      continue;
    }
    
    const parts = line.split(";").map((p) => p.trim());
    
    if (parts.length < 4) {
      errors.push(`Riga ${lineNum}: formato non valido (servono almeno 4 campi separati da ;)`);
      continue;
    }

    const [name, category, priceStr, quantityStr, image] = parts;
    
    if (!name) {
      errors.push(`Riga ${lineNum}: nome mancante`);
      continue;
    }
    
    if (!category) {
      errors.push(`Riga ${lineNum}: categoria mancante per "${name}"`);
      continue;
    }
    
    const price = parseFloat(priceStr);
    if (isNaN(price) || price < 0) {
      errors.push(`Riga ${lineNum}: prezzo non valido per "${name}" (${priceStr})`);
      continue;
    }
    
    const initialQuantity = parseInt(quantityStr, 10);
    if (isNaN(initialQuantity) || initialQuantity < 0) {
      errors.push(`Riga ${lineNum}: quantità non valida per "${name}" (${quantityStr})`);
      continue;
    }

    if (initialQuantity === 0) {
      warnings.push(`Riga ${lineNum}: "${name}" ha quantità 0`);
    }

    products.push({
      name,
      category,
      price,
      initialQuantity,
      image: image || null,
    });
  }

  return { products, errors, warnings };
}

export function exportToCSV(products: Product[]): string {
  const lines = products.map((p) => {
    const finalQuantity = p.initialQuantity - p.soldCount + p.createdCount;
    return `${p.name};${p.category};${p.price};${finalQuantity};${p.image || ""}`;
  });
  return lines.join("\n");
}

export function exportDetailedReport(products: Product[]): string {
  const header = "Nome;Categoria;Prezzo;Qty Iniziale;Venduti;Creati;Qty Finale";
  const lines = products.map((p) => {
    const finalQuantity = p.initialQuantity - p.soldCount + p.createdCount;
    return `${p.name};${p.category};${p.price};${p.initialQuantity};${p.soldCount};${p.createdCount};${finalQuantity}`;
  });
  return [header, ...lines].join("\n");
}

export function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
