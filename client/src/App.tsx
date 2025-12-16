import { useState, useEffect, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { HomeScreen } from "@/components/HomeScreen";
import { ImportWizard } from "@/components/ImportWizard";
import { ManualEntryWizard } from "@/components/ManualEntryWizard";
import { SalesScreen } from "@/components/SalesScreen";
import {
  getAllProducts,
  importProducts,
  addProduct,
  updateProduct,
  setMetadata,
  getMetadata,
} from "@/lib/indexeddb";
import type { Product, InsertProduct, AppScreen } from "@shared/schema";

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("home");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExported, setHasExported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadProducts() {
      try {
        const storedProducts = await getAllProducts();
        setProducts(storedProducts);
        const exported = await getMetadata<boolean>("hasExported");
        setHasExported(exported ?? true);
      } catch (error) {
        console.error("Failed to load products:", error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i prodotti",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [toast]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasChanges = products.some((p) => p.soldCount > 0 || p.createdCount > 0);
      if (hasChanges && !hasExported) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [products, hasExported]);

  const handleNavigate = useCallback((screen: AppScreen) => {
    setCurrentScreen(screen);
  }, []);

  const handleImport = useCallback(
    async (newProducts: InsertProduct[]) => {
      try {
        const imported = await importProducts(newProducts);
        setProducts(imported);
        setHasExported(false);
        await setMetadata("hasExported", false);
        toast({
          title: "Importazione completata",
          description: `${imported.length} prodotti importati`,
        });
        setCurrentScreen("sales");
      } catch (error) {
        console.error("Failed to import products:", error);
        toast({
          title: "Errore",
          description: "Impossibile importare i prodotti",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleAddProducts = useCallback(
    async (newProducts: InsertProduct[]) => {
      try {
        const added: Product[] = [];
        for (const product of newProducts) {
          const newProduct = await addProduct(product);
          added.push(newProduct);
        }
        setProducts((prev) => [...prev, ...added]);
        setHasExported(false);
        await setMetadata("hasExported", false);
        toast({
          title: "Prodotti aggiunti",
          description: `${added.length} prodotti aggiunti`,
        });
        setCurrentScreen("sales");
      } catch (error) {
        console.error("Failed to add products:", error);
        toast({
          title: "Errore",
          description: "Impossibile aggiungere i prodotti",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleUpdateProduct = useCallback(
    async (updated: Product) => {
      try {
        await updateProduct(updated);
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        setHasExported(false);
        await setMetadata("hasExported", false);
      } catch (error) {
        console.error("Failed to update product:", error);
        toast({
          title: "Errore",
          description: "Impossibile aggiornare il prodotto",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleExport = useCallback(async () => {
    setHasExported(true);
    await setMetadata("hasExported", true);
    toast({
      title: "Esportazione completata",
      description: "I dati sono stati salvati",
    });
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentScreen === "home" && (
        <HomeScreen
          onNavigate={handleNavigate}
          hasProducts={products.length > 0}
        />
      )}
      {currentScreen === "import" && (
        <ImportWizard onNavigate={handleNavigate} onImport={handleImport} />
      )}
      {currentScreen === "manual" && (
        <ManualEntryWizard
          onNavigate={handleNavigate}
          onAddProducts={handleAddProducts}
        />
      )}
      {currentScreen === "sales" && (
        <SalesScreen
          products={products}
          onUpdateProduct={handleUpdateProduct}
          onNavigate={handleNavigate}
          onExport={handleExport}
          hasExported={hasExported}
        />
      )}
      <Toaster />
    </>
  );
}

export default App;
