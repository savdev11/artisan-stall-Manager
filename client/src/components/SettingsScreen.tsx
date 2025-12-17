import { useState } from "react";
import { Home, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AppScreen } from "@shared/schema";

interface SettingsScreenProps {
  categories: string[];
  onUpdateCategories: (categories: string[]) => void;
  onNavigate: (screen: AppScreen) => void;
}

export function SettingsScreen({
  categories,
  onUpdateCategories,
  onNavigate,
}: SettingsScreenProps) {
  const [newCategory, setNewCategory] = useState("");

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

      <main className="p-4 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categorie Prodotti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gestisci le categorie disponibili per i tuoi prodotti. Puoi aggiungere, rimuovere o riordinare le categorie.
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
