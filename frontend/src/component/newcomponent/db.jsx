// db.js
export function openDB() {
  return new Promise((resolve, reject) => {
    // Bump version to 2 to migrate keyPath from "id" to "_id"
    const request = indexedDB.open("CartDB", 2);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("cart")) {
        db.createObjectStore("cart", { keyPath: "_id" });
      } else {
        try {
          const tx = event.target.transaction;
          const store = tx.objectStore("cart");
          if (store.keyPath !== "_id") {
            // Migration path for existing store with old keyPath "id"
            db.deleteObjectStore("cart");
            db.createObjectStore("cart", { keyPath: "_id" });
          }
        } catch (_) {
          // If transaction not available, fallback: recreate store
          try {
            db.deleteObjectStore("cart");
            db.createObjectStore("cart", { keyPath: "_id" });
          } catch (_) {}
        }
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveCartItem(item) {
  const db = await openDB();
  const tx = db.transaction("cart", "readwrite");
  const store = tx.objectStore("cart");
  store.put(item);
  return tx.complete;
}

export async function getCartItems() {
  const db = await openDB();
  const tx = db.transaction("cart", "readonly");
  const store = tx.objectStore("cart");
  const request = store.getAll();
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function clearCart() {
  const db = await openDB();
  const tx = db.transaction("cart", "readwrite");
  tx.objectStore("cart").clear();
  return tx.complete;
}
