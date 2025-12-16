import type { Product, InsertProduct } from "@shared/schema";

const DB_NAME = "artisan-stall-db";
const DB_VERSION = 1;
const STORE_NAME = "products";
const META_STORE = "metadata";

let db: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id" });
      }

      if (!database.objectStoreNames.contains(META_STORE)) {
        database.createObjectStore(META_STORE, { keyPath: "key" });
      }
    };
  });
}

export async function getAllProducts(): Promise<Product[]> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function addProduct(product: InsertProduct): Promise<Product> {
  const database = await initDB();
  const newProduct: Product = {
    ...product,
    id: crypto.randomUUID(),
    soldCount: 0,
    createdCount: 0,
  };

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(newProduct);

    request.onsuccess = () => resolve(newProduct);
    request.onerror = () => reject(request.error);
  });
}

export async function updateProduct(product: Product): Promise<Product> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(product);

    request.onsuccess = () => resolve(product);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteProduct(id: string): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearAllProducts(): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function importProducts(products: InsertProduct[]): Promise<Product[]> {
  await clearAllProducts();
  const imported: Product[] = [];
  for (const product of products) {
    const newProduct = await addProduct(product);
    imported.push(newProduct);
  }
  return imported;
}

export async function setMetadata(key: string, value: unknown): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(META_STORE, "readwrite");
    const store = transaction.objectStore(META_STORE);
    const request = store.put({ key, value });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getMetadata<T>(key: string): Promise<T | null> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(META_STORE, "readonly");
    const store = transaction.objectStore(META_STORE);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result?.value ?? null);
    request.onerror = () => reject(request.error);
  });
}
