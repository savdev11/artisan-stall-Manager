import { Upload, PenLine, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AppScreen } from "@shared/schema";

interface HomeScreenProps {
  onNavigate: (screen: AppScreen) => void;
  hasProducts: boolean;
}

export function HomeScreen({ onNavigate, hasProducts }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full mb-4">
            <Package className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Artisan Stall Manager
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Gestisci il tuo inventario per la bancarella
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          <Card
            className="hover-elevate active-elevate-2 cursor-pointer min-h-48 md:min-h-64 flex flex-col"
            onClick={() => onNavigate("import")}
            data-testid="card-import-database"
          >
            <CardContent className="flex flex-col items-center justify-center flex-1 p-6 md:p-8 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-7 h-7 md:w-8 md:h-8 text-primary" />
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                Importa Database
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Carica un file CSV o TXT con i tuoi prodotti
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover-elevate active-elevate-2 cursor-pointer min-h-48 md:min-h-64 flex flex-col"
            onClick={() => onNavigate("manual")}
            data-testid="card-manual-entry"
          >
            <CardContent className="flex flex-col items-center justify-center flex-1 p-6 md:p-8 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                <PenLine className="w-7 h-7 md:w-8 md:h-8 text-accent-foreground" />
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                Inserimento Manuale
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Aggiungi i prodotti uno alla volta
              </p>
            </CardContent>
          </Card>
        </div>

        {hasProducts && (
          <div className="text-center">
            <Card
              className="hover-elevate active-elevate-2 cursor-pointer inline-block"
              onClick={() => onNavigate("sales")}
              data-testid="card-continue-sales"
            >
              <CardContent className="flex items-center gap-3 p-4 md:p-6">
                <Package className="w-6 h-6 text-primary" />
                <span className="text-base md:text-lg font-medium">
                  Continua con i prodotti esistenti
                </span>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
