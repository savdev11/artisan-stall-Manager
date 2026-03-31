import { useRef, useState } from "react";
import { Home, Plus, Trash2, GripVertical, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { buildBackup, parseBackup, serializeBackup } from "@/lib/backup-utils";
import { downloadFile } from "@/lib/file-utils";
import type { AppScreen, AppBackup, Product } from "@shared/schema";

interface SettingsScreenProps {
  categories: string[];
  products: Product[];
  onUpdateCategories: (categories: string[]) => void;
  onRestoreBackup: (backup: AppBackup) => void;
  onNavigate: (screen: AppScreen) => void;
}

export function SettingsScreen({
  categories,
  products,
  onUpdateCategories,
  onRestoreBackup,
  onNavigate,
}: SettingsScreenProps) {
  const [newCategory, setNewCategory] = useState("");
  const restoreInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      onUpdateCategories([...categories, trimmed]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (index: number) => {
    onUpdateCategories(categories.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCategory();
    }
  };

  const handleExportBackup = () => {
    const backup = buildBackup(products, categories);
    const content = serializeBackup(backup);
    const date = new Date().toISOString().split("T")[0];
    downloadFile(
      content,
      `artisan-stall-backup-${date}.json`,
      "application/json;charset=utf-8",
    );

    toast({
      title: "Backup esportato",
      description: "File JSON creato. Importalo nel nuovo dominio per migrare i dati.",
    });
  };

  const handleBackupFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const backup = parseBackup(content);
      onRestoreBackup(backup);
    } catch (error) {
      toast({
        title: "Backup non valido",
        description:
          error instanceof Error
            ? error.message
            : "Impossibile leggere il file di backup.",
        variant: "destructive",
      });
    } finally {
      if (restoreInputRef.current) {
        restoreInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between gap-4 p-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("home")}
              data-testid="button-settings-home"
            >
              <Home className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground">Impostazioni</h1>
              <p className="text-xs text-muted-foreground">
                Configura l'applicazione
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Migrazione Dati (Dominio)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              I dati sono salvati nel browser (IndexedDB) e non si trasferiscono automaticamente tra domini diversi.
              Prima del passaggio dal vecchio dominio Replit al nuovo dominio VPS, esporta un backup JSON e poi importalo nel nuovo dominio.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleExportBackup}
                className="flex-1"
                data-testid="button-export-backup"
              >
                <Download className="w-4 h-4 mr-2" />
                Esporta Backup JSON
              </Button>

              <input
                ref={restoreInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleBackupFileChange}
                className="hidden"
                id="restore-backup-input"
                data-testid="input-restore-backup"
              />
              <label htmlFor="restore-backup-input" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  data-testid="button-import-backup"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importa Backup JSON
                </Button>
              </label>
            </div>

            <p className="text-xs text-muted-foreground">
              Il backup JSON conserva prodotti, contatori venduti/creati, immagini e categorie.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categorie Prodotti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gestisci le categorie disponibili per i tuoi prodotti. Puoi aggiungere o rimuovere le categorie.
            </p>

            <div className="flex gap-2">
              <Input
                placeholder="Nuova categoria..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
                data-testid="input-new-category"
              />
              <Button
                onClick={handleAddCategory}
                disabled={!newCategory.trim() || categories.includes(newCategory.trim())}
                data-testid="button-add-category"
              >
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi
              </Button>
            </div>

            <div className="space-y-2">
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nessuna categoria. Aggiungi la prima categoria sopra.
                </p>
              ) : (
                categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
                    data-testid={`category-item-${index}`}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 font-medium">{category}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCategory(index)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      data-testid={`button-remove-category-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {categories.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {categories.length} {categories.length === 1 ? "categoria" : "categorie"}
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
