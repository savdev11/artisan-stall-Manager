import { useState, useRef } from "react";
import { Upload, FileText, ArrowLeft, Check, X, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseCSV, type ParseResult } from "@/lib/file-utils";
import type { InsertProduct, AppScreen } from "@shared/schema";

interface ImportWizardProps {
  onNavigate: (screen: AppScreen) => void;
  onImport: (products: InsertProduct[]) => void;
}

export function ImportWizard({ onNavigate, onImport }: ImportWizardProps) {
  const [dragActive, setDragActive] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setFileError(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const result = parseCSV(content);
        if (result.products.length === 0 && result.errors.length === 0) {
          setFileError("Il file è vuoto o non contiene dati validi");
          setParseResult(null);
        } else {
          setParseResult(result);
        }
      } catch {
        setFileError("Errore nella lettura del file");
        setParseResult(null);
      }
    };
    reader.onerror = () => {
      setFileError("Errore nella lettura del file");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleConfirm = () => {
    if (parseResult && parseResult.products.length > 0) {
      onImport(parseResult.products);
    }
  };

  const handleReset = () => {
    setParseResult(null);
    setFileName(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const canConfirm = parseResult && parseResult.products.length > 0;

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
          Importa Database
        </h1>
        <p className="text-muted-foreground mb-6">
          Formato file: nome;categoria;prezzo;quantità;immagine
        </p>

        {!parseResult ? (
          <Card className="mb-6">
            <CardContent className="p-0">
              <div
                className={`border-2 border-dashed rounded-lg p-8 md:p-12 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  data-testid="input-file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium text-foreground mb-2">
                    Trascina il file qui
                  </p>
                  <p className="text-muted-foreground mb-4">
                    oppure clicca per selezionare
                  </p>
                  <Button variant="outline" type="button" data-testid="button-select-file">
                    Seleziona File
                  </Button>
                </label>
              </div>

              {fileError && (
                <div className="p-4 bg-destructive/10 border-t border-destructive/20 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <p className="text-destructive text-sm">{fileError}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">{fileName}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  data-testid="button-reset-import"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {parseResult.errors.length > 0 && (
                  <div className="p-4 bg-destructive/10 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-destructive font-medium">
                      <AlertCircle className="w-4 h-4" />
                      <span>Errori trovati ({parseResult.errors.length})</span>
                    </div>
                    <ul className="text-sm text-destructive space-y-1 max-h-32 overflow-y-auto">
                      {parseResult.errors.map((error, idx) => (
                        <li key={idx} data-testid={`text-import-error-${idx}`}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {parseResult.warnings.length > 0 && (
                  <div className="p-4 bg-chart-4/10 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-chart-4 font-medium">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Avvisi ({parseResult.warnings.length})</span>
                    </div>
                    <ul className="text-sm text-chart-4 space-y-1 max-h-24 overflow-y-auto">
                      {parseResult.warnings.map((warning, idx) => (
                        <li key={idx} data-testid={`text-import-warning-${idx}`}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {parseResult.products.length > 0 && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      {parseResult.products.length} prodotti validi trovati
                    </p>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {parseResult.products.map((product, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                          data-testid={`row-import-product-${index}`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {product.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {product.category} - €{product.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-medium text-foreground">
                              x{product.initialQuantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {parseResult.products.length === 0 && parseResult.errors.length > 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Correggi gli errori nel file e riprova
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1"
                data-testid="button-cancel-import"
              >
                Annulla
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!canConfirm}
                className="flex-1"
                data-testid="button-confirm-import"
              >
                <Check className="w-4 h-4 mr-2" />
                Conferma Importazione ({parseResult.products.length})
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
