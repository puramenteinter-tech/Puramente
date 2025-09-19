// db.js
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("CartDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("cart")) {
        db.createObjectStore("cart", { keyPath: "id" });
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
