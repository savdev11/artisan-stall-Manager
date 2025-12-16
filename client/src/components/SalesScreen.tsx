import { useState } from "react";
import { Home, Download, Package, Plus, Minus, ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product, AppScreen } from "@shared/schema";
import { exportToCSV, exportDetailedReport, downloadFile } from "@/lib/file-utils";

interface SalesScreenProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onNavigate: (screen: AppScreen) => void;
  onExport: () => void;
  hasExported: boolean;
}

interface ProductCardProps {
  product: Product;
  onUpdate: (product: Product) => void;
}

function ProductCard({ product, onUpdate }: ProductCardProps) {
  const finalQuantity = product.initialQuantity - product.soldCount + product.createdCount;
  const isLowStock = finalQuantity <= 2 && finalQuantity > 0;
  const isOutOfStock = finalQuantity <= 0;

  const handleSold = (delta: number) => {
    const newSoldCount = Math.max(0, product.soldCount + delta);
    if (delta > 0 && finalQuantity <= 0) return;
    onUpdate({ ...product, soldCount: newSoldCount });
  };

  const handleCreated = (delta: number) => {
    const newCreatedCount = Math.max(0, product.createdCount + delta);
    onUpdate({ ...product, createdCount: newCreatedCount });
  };

  return (
    <Card
      className={`overflow-visible ${isOutOfStock ? "opacity-60" : ""}`}
      data-testid={`card-product-${product.id}`}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-md bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-8 h-8 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground truncate" data-testid={`text-product-name-${product.id}`}>
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>
              <Badge
                variant="secondary"
                className={`flex-shrink-0 ${
                  isOutOfStock
                    ? "bg-destructive/10 text-destructive"
                    : isLowStock
                    ? "bg-chart-4/20 text-chart-4"
                    : ""
                }`}
              >
                €{product.price.toFixed(2)}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Qty:</span>
                <span
                  className={`font-bold text-lg ${
                    isOutOfStock
                      ? "text-destructive"
                      : isLowStock
                      ? "text-chart-4"
                      : "text-foreground"
                  }`}
                  data-testid={`text-quantity-${product.id}`}
                >
                  {finalQuantity}
                </span>
              </div>
              {product.soldCount > 0 && (
                <div className="flex items-center gap-1 text-primary">
                  <ShoppingBag className="w-3 h-3" />
                  <span className="text-xs">{product.soldCount}</span>
                </div>
              )}
              {product.createdCount > 0 && (
                <div className="flex items-center gap-1 text-chart-3">
                  <Sparkles className="w-3 h-3" />
                  <span className="text-xs">{product.createdCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleSold(-1)}
              disabled={product.soldCount <= 0}
              className="h-14 w-14 p-0"
              data-testid={`button-sold-minus-${product.id}`}
            >
              <Minus className="w-5 h-5" />
            </Button>
            <div className="flex-1 text-center">
              <p className="text-xs text-muted-foreground">Venduti</p>
              <p className="font-semibold text-primary text-lg">{product.soldCount}</p>
            </div>
            <Button
              variant="default"
              size="lg"
              onClick={() => handleSold(1)}
              disabled={finalQuantity <= 0}
              className="h-14 w-14 p-0"
              data-testid={`button-sold-plus-${product.id}`}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleCreated(-1)}
              disabled={product.createdCount <= 0}
              className="h-14 w-14 p-0"
              data-testid={`button-created-minus-${product.id}`}
            >
              <Minus className="w-5 h-5" />
            </Button>
            <div className="flex-1 text-center">
              <p className="text-xs text-muted-foreground">Creati</p>
              <p className="font-semibold text-chart-3 text-lg">{product.createdCount}</p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleCreated(1)}
              className="h-14 w-14 p-0"
              data-testid={`button-created-plus-${product.id}`}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SalesScreen({
  products,
  onUpdateProduct,
  onNavigate,
  onExport,
  hasExported,
}: SalesScreenProps) {
  const [showExportDialog, setShowExportDialog] = useState(false);

  const totalSold = products.reduce((sum, p) => sum + p.soldCount, 0);
  const totalRevenue = products.reduce((sum, p) => sum + p.soldCount * p.price, 0);
  const totalCreated = products.reduce((sum, p) => sum + p.createdCount, 0);

  const handleExportCSV = () => {
    const content = exportToCSV(products);
    const date = new Date().toISOString().split("T")[0];
    downloadFile(content, `inventario-${date}.csv`);
    onExport();
    setShowExportDialog(false);
  };

  const handleExportReport = () => {
    const content = exportDetailedReport(products);
    const date = new Date().toISOString().split("T")[0];
    downloadFile(content, `report-${date}.csv`);
    onExport();
    setShowExportDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between gap-4 p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("home")}
              data-testid="button-go-home"
            >
              <Home className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground">Vendite</h1>
              <p className="text-xs text-muted-foreground">
                {products.length} prodotti
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowExportDialog(true)}
            data-testid="button-export"
          >
            <Download className="w-4 h-4 mr-2" />
            Esporta
          </Button>
        </div>

        {!hasExported && products.some((p) => p.soldCount > 0 || p.createdCount > 0) && (
          <div className="bg-chart-4/10 border-t border-chart-4/20 px-4 py-2">
            <p className="text-sm text-chart-4 text-center">
              Ricorda di esportare i dati prima di chiudere
            </p>
          </div>
        )}

        <div className="bg-muted/50 border-t border-border px-4 py-3">
          <div className="flex items-center justify-center gap-6 max-w-7xl mx-auto">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary" data-testid="text-total-sold">
                {totalSold}
              </p>
              <p className="text-xs text-muted-foreground">Venduti</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground" data-testid="text-total-revenue">
                €{totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Incasso</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-chart-3" data-testid="text-total-created">
                {totalCreated}
              </p>
              <p className="text-xs text-muted-foreground">Creati</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onUpdate={onUpdateProduct}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">
              Nessun prodotto
            </p>
            <p className="text-muted-foreground mb-4">
              Importa o aggiungi prodotti per iniziare
            </p>
            <Button onClick={() => onNavigate("home")} data-testid="button-add-products">
              Aggiungi prodotti
            </Button>
          </div>
        )}
      </main>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Esporta Dati</DialogTitle>
            <DialogDescription>
              Scegli il formato di esportazione
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4 text-center p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-2xl font-bold text-primary">{totalSold}</p>
                <p className="text-xs text-muted-foreground">Venduti</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">€{totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Incasso</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-chart-3">{totalCreated}</p>
                <p className="text-xs text-muted-foreground">Creati</p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="flex-1"
              data-testid="button-export-csv"
            >
              Esporta Inventario
            </Button>
            <Button
              onClick={handleExportReport}
              className="flex-1"
              data-testid="button-export-report"
            >
              Esporta Report Dettagliato
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
