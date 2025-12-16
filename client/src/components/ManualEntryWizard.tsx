import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Check, ImagePlus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InsertProduct, AppScreen } from "@shared/schema";

interface ManualEntryWizardProps {
  onNavigate: (screen: AppScreen) => void;
  onAddProducts: (products: InsertProduct[]) => void;
}

const CATEGORIES = [
  "Collane",
  "Braccialetti",
  "Anelli",
  "Orecchini",
  "Ciondoli",
  "Accessori",
  "Altro",
];

interface ProductDraft {
  id: string;
  name: string;
  category: string;
  price: string;
  initialQuantity: string;
  image: string | null;
}

const createEmptyDraft = (): ProductDraft => ({
  id: crypto.randomUUID(),
  name: "",
  category: "",
  price: "",
  initialQuantity: "1",
  image: null,
});

export function ManualEntryWizard({ onNavigate, onAddProducts }: ManualEntryWizardProps) {
  const [products, setProducts] = useState<ProductDraft[]>([createEmptyDraft()]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentProduct = products[currentIndex];

  const updateCurrentProduct = (updates: Partial<ProductDraft>) => {
    setProducts((prev) =>
      prev.map((p, i) => (i === currentIndex ? { ...p, ...updates } : p))
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateCurrentProduct({ image: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewProduct = () => {
    const newDraft = createEmptyDraft();
    setProducts((prev) => [...prev, newDraft]);
    setCurrentIndex(products.length);
  };

  const removeProduct = (index: number) => {
    if (products.length === 1) return;
    setProducts((prev) => prev.filter((_, i) => i !== index));
    if (currentIndex >= products.length - 1) {
      setCurrentIndex(Math.max(0, products.length - 2));
    } else if (currentIndex > index) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const isProductValid = (product: ProductDraft): boolean => {
    return (
      product.name.trim() !== "" &&
      product.category !== "" &&
      parseFloat(product.price) >= 0 &&
      parseInt(product.initialQuantity, 10) >= 0
    );
  };

  const validProducts = products.filter(isProductValid);

  const handleConfirm = () => {
    const insertProducts: InsertProduct[] = validProducts.map((p) => ({
      name: p.name.trim(),
      category: p.category,
      price: parseFloat(p.price) || 0,
      initialQuantity: parseInt(p.initialQuantity, 10) || 0,
      image: p.image,
    }));
    onAddProducts(insertProducts);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => onNavigate("home")}
          className="mb-6"
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Indietro
        </Button>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Inserimento Manuale
        </h1>
        <p className="text-muted-foreground mb-6">
          Aggiungi i tuoi prodotti uno alla volta
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center justify-between gap-4">
                  <span>Prodotto {currentIndex + 1} di {products.length}</span>
                  {products.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProduct(currentIndex)}
                      className="text-destructive"
                      data-testid="button-remove-current-product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome prodotto</Label>
                  <Input
                    id="name"
                    placeholder="Es. Collana con perle"
                    value={currentProduct.name}
                    onChange={(e) => updateCurrentProduct({ name: e.target.value })}
                    data-testid="input-product-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={currentProduct.category}
                    onValueChange={(value) => updateCurrentProduct({ category: value })}
                  >
                    <SelectTrigger id="category" data-testid="select-category">
                      <SelectValue placeholder="Seleziona categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Prezzo (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="0.00"
                      value={currentProduct.price}
                      onChange={(e) => updateCurrentProduct({ price: e.target.value })}
                      data-testid="input-product-price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantità</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      step="1"
                      value={currentProduct.initialQuantity}
                      onChange={(e) =>
                        updateCurrentProduct({ initialQuantity: e.target.value })
                      }
                      data-testid="input-product-quantity"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Immagine (opzionale)</Label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      data-testid="input-image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer"
                    >
                      <div className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden">
                        {currentProduct.image ? (
                          <img
                            src={currentProduct.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImagePlus className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                    </label>
                    {currentProduct.image && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateCurrentProduct({ image: null })}
                        data-testid="button-remove-image"
                      >
                        Rimuovi
                      </Button>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={addNewProduct}
                    className="flex-1"
                    data-testid="button-add-another-product"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Aggiungi altro
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Prodotti aggiunti</CardTitle>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nessun prodotto
                  </p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {products.map((product, index) => (
                      <div
                        key={product.id}
                        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                          index === currentIndex
                            ? "bg-primary/10 border border-primary/20"
                            : "bg-muted/50 hover-elevate"
                        }`}
                        onClick={() => setCurrentIndex(index)}
                        data-testid={`row-manual-product-${index}`}
                      >
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {product.name || "Senza nome"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.category || "Nessuna categoria"}
                          </p>
                        </div>
                        {isProductValid(product) && (
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-4">
              <Button
                onClick={handleConfirm}
                disabled={validProducts.length === 0}
                className="w-full"
                data-testid="button-confirm-products"
              >
                <Check className="w-4 h-4 mr-2" />
                Inizia vendita ({validProducts.length})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
